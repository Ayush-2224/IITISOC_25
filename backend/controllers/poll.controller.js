import Poll from "../models/poll.model.js";
import {io} from "../config/socket.js"
const createPoll = async (req, res) => {
    try {
        const { groupId, question, options, userId } = req.body;
        // const userId = req.user._id;
        const newPoll = new Poll({
            groupId,
            userId,
            question,
            options
        });

        await newPoll.save();

        io.to(groupId).emit('send-poll', newPoll);

        res.status(201).json({
            success: true,
            message: "Poll created successfully",
            data: newPoll
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const increaseVote = async (req, res) => {
    const { pollId } = req.params;
    const { userId, option } = req.body;

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found"
            });
        }

        if (!poll.options.includes(option)) {
            return res.status(400).json({
                success: false,
                message: "Invalid poll option"
            });
        }

        const userKey = userId.toString();
        const previousOption = poll.votes.get(userKey);

        if (previousOption) {
            if (previousOption !== option) {
                poll.count.set(previousOption, (poll.count.get(previousOption) || 1) - 1);
                poll.count.set(option, (poll.count.get(option) || 0) + 1);
                poll.votes.set(userKey, option);
            }
        } else {
            poll.count.set(option, (poll.count.get(option) || 0) + 1);
            poll.votes.set(userKey, option);
        }

        const totalVotes = Array.from(poll.count.values()).reduce((a, b) => a + b, 0);
        const percentages = {};

        poll.options.forEach(opt => {
            const count = poll.count.get(opt) || 0;
            percentages[opt] = totalVotes ? parseFloat(((count / totalVotes) * 100).toFixed(1)) : 0.0;
            poll.percentages.set(opt, percentages[opt]);
        });

        poll.markModified("count");
        poll.markModified("votes");
        poll.markModified("percentages");
        await poll.save();

        io.to(poll.groupId.toString()).emit("poll-update", {
            pollId: poll._id,
            percentages
        });

        io.to(poll.groupId.toString()).emit("vote-poll", {
            pollId: poll._id,
            userId,
            option
        });

        res.status(200).json({
            success: true,
            message: "Vote recorded successfully",
            data: poll
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { createPoll, increaseVote };
