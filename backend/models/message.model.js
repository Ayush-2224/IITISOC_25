import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    senderId:{
        ref:'user2',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    eventId:{
        ref:'Event',
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    }
},{timestamps:true});

const Message= mongoose.model('Message', messageSchema);

export default Message;