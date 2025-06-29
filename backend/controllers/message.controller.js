import Message from "../models/message.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import Poll from "../models/poll.model.js";

const sendMessage = async (req, res) => {
    try {
        const { text, userId } = req.body;
        const { groupId } = req.params;
        let imageUrl;
        
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const newMessage = new Message({
            senderId: userId,
            groupId,
            text,
            image: imageUrl ? imageUrl : undefined
        });

        await newMessage.save();

        // Populate sender information for the response
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('senderId', 'name profilePic');

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: populatedMessage
        });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const combinedFeed = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        // Get all messages for the event
        const messages = await Message.find({ groupId: groupId })
            .populate('senderId', 'name profilePic')
            .sort({ createdAt: -1 });
        
        // Get all polls for the event
        const polls = await Poll.find({ groupId: groupId })
            .populate('userId', 'name');
        
        // Combine messages and polls into one array
        const combinedData = [
            ...messages.map(msg => ({ ...msg._doc, type: 'message' })),
            ...polls.map(poll => ({ ...poll._doc, type: 'poll' }))
        ];

        // Sort all items by createdAt descending
        const sortedCombinedData = combinedData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            message: "Messages and polls retrieved successfully",
            feed: sortedCombinedData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { sendMessage, combinedFeed };
