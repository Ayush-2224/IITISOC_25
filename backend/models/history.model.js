import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    watchedMovie: {
        type:String,
        required: true,
    }
}, { timestamps: true });

const History = mongoose.model("History", historySchema);
export default History;