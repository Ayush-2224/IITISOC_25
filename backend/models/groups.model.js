import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description:{type:String,required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user2", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user2", default: [] }],
    inviteToken: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
export default Group;
