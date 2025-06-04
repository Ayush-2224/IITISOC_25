import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    invitedEmails: [
        {
            type: String,
            match: /.+@.+..+/,
        },
    ],
    participantStatus: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "declined"],
                default: "pending",
            },
        },
    ],
    suggestedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
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

const Event = mongoose.model("Event", eventSchema);
export default Event;