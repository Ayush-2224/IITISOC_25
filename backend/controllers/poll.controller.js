import Poll from "../models/poll.model";

const createPoll = async (req, res) => {
    try {
        const { eventId, question, options } = req.body;
        const userId = req.user._id;
        const newPoll = new Poll({
            eventId,
            userId,
            question,
            options
        });

        await newPoll.save();

        io.to(eventId).emit('send-poll', newPoll);

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
        if (!poll.options.includes(option)) {
            return res.status(400).json({
                success: false,
                message: "Invalid poll option"
            });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found"
            });
        }
        if (poll.votes.has(userId)) {
            const previousOption = poll.votes.get(userId);
            poll.count.set(previousOption, (poll.count.get(previousOption)) - 1);
            poll.count.set(option, (poll.count.get(option) || 0) + 1);
            poll.votes.set(userId, option);
        }

        else {
            poll.count.set(option, (poll.count.get(option) || 0) + 1);
            poll.votes.set(userId, option);
        }
        await poll.save();
        const totalVotes = Array.from(poll.count.values()).reduce((a, b) => a + b, 0);

        const percentages = {};
        poll.options.forEach((option) => {
            const count = poll.count.get(option) || 0;
            percentages[option] = totalVotes ? ((count / totalVotes) * 100).toFixed(1) : 0;
        });

        io.to(poll.eventId.toString()).emit("poll-update", {
            pollId: poll._id,
            percentages,
        });
        io.to(poll.eventId.toString()).emit("vote-poll", {
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
}

export { createPoll, increaseVote };