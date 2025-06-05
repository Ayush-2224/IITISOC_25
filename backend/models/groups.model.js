import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User",default: [] }],
    eventDate: Date,
    location: String,
    notes: String,
    inviteToken: String,
    watchlist: { type: mongoose.Schema.Types.ObjectId, ref: "Watchlist" },
    }, { timestamps: true });

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
export default Group;