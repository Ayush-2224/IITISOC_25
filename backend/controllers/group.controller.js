import Group from "../models/groups.model.js";
import crypto from "crypto";

// Create Group
export const createGroup = async (req, res) => {
  try {
    const { name, createdBy ,description,members} = req.body;

    const inviteToken = crypto.randomBytes(8).toString("hex");

    const group = new Group({
      name,
      createdBy,
      inviteToken,
      members,
      description
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

// join group
export const joinGroup = async (req, res) => {
  const { token } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findOne({ inviteToken: token });
    if (!group) return res.status(404).json({ error: "Invalid invite link" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ message: "Joined group successfully", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get user groups
export const getUserGroups = async (req, res) => {
  const { userId } = req.params;
  try {
    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get group by id
export const getGroupById = async (req, res) => {
  console.log(req.params.id)
  try {
    const group = await Group.findById(req.params.id)
  .populate("members", "name email")
  .populate("createdBy", "name email"); // Optional, if needed

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete the group
export const deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Optional: Only allow creator to delete
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this group" });
    }

    await group.deleteOne();
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};