import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  profilePic: {
    type: String,
    default: "https://api.dicebear.com/9.x/micah/svg?seed=Christopher",
  },
});

const userModel = mongoose.models.user2 || mongoose.model("user2", userSchema);

export default userModel;
