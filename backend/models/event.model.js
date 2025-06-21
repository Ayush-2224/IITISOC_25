import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user2",
        required: true,
    },
    Group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: false,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user2",
        }
    ],
    suggestedMovies: [
        {
            type:String,
        },
    ],
    reminder: {
        sendReminder: {
            type: Boolean,
            default: false,
        },
        reminderTime: {
            type: Date,
        },
    },
}, { timestamps: true });

eventSchema.pre("save", function (next) {
    if (!this.participants.includes(this.createdBy)) {
        this.participants.push(this.createdBy);
    }
    next();
});

const Event = mongoose.model("Event", eventSchema);
export default Event;