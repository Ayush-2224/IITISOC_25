import Message from "../models/message.model";
import { uploadToCloudinary } from "../config/cloudinary";
import Poll from "../models/poll.model";
import { io } from "../config/socket.js";
const sendMessage= async(req,res)=>{
        try {
            const {text}=req.body
            const {eventId}=req.params
            const {userId}=req.user
            let imageUrl
            if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url

        }

        const newMessage=  new Message(
            {senderId:userId,
            eventId,
            text,
            image:imageUrl ? imageUrl : undefined}
        )

        await newMessage.save();

        io.to(eventId).emit('receive-message', newMessage);

        res.status(201).json({
            success:true,
            message:"Message sent successfully",
            data:newMessage
        })

        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
}

const combinedFeed = async (req, res) => {
    try {
        const { eventID } = req.params;

        // Get all messages for the event
        const messages = await Message.find({ eventId: eventID })
            .populate('senderId', 'name profilePic')
            .sort({ createdAt: -1 });

        // Get all polls for the event
        const polls = await Poll.find({ eventId: eventID })
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
