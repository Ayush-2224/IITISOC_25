import mongoose from "mongoose";

const pollSchema=mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        unique:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user2',
        required:true,
    },
    question: {
        type: String,
        required: true,
    },
    options:{
        type: [String],
        required: true,
    },
    count: {
    type: Map,  
    of: Number, // option->no. of votes
    default: {},
  },
  votes: {
    type: Map,
    of: String, // userId -> movie name
    default: {},
  },

},{timestamps:true});
const Poll= mongoose.model("Poll", pollSchema);
export default Poll;