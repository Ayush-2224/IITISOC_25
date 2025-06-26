import Group from "../models/groups.model.js";
import crypto from "crypto";
import History from "../models/history.model.js";
import axios from "axios";
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

// leave group
export const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  const { memberId } = req.body; // Optional: member to remove

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // If the requester is the creator and a memberId is provided, allow removing that member
    if (group.createdBy.toString() === userId && memberId) {
      // Prevent creator from removing themselves via this method
      if (memberId === userId) {
        return res.status(403).json({ 
          message: "Group creator cannot remove themselves. Please delete the group instead." 
        });
      }
      // Check if memberId is in group
      if (!group.members.includes(memberId)) {
        return res.status(400).json({ message: "User is not a member of this group" });
      }
      group.members = group.members.filter(mId => mId.toString() !== memberId);
      await group.save();
      return res.status(200).json({ message: "Member removed from group", group });
    }

    // If not creator, only allow user to remove themselves
    if (group.createdBy.toString() === userId) {
      return res.status(403).json({ 
        message: "Group creator cannot leave the group. Please delete the group instead." 
      });
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // Remove user from members array
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    res.status(200).json({ 
      message: "Successfully left the group",
      group 
    });
  } catch (err) {
    console.error('Leave group error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const recommendMovie = async (req, res) => {
  try {
    const { groupId } = req.params;

    const history = await History.findOne({ group: groupId });
    if (!history) {
      return res.status(404).json({ message: "No history found for this group" });
    }

    const watchedIds = history.watchedMovie || []; // now an array of string movie IDs

    if (watchedIds.length === 0) {
      return res.status(400).json({ message: "No movies found in group history" });
    }

    const response = await axios.post("http://localhost:5000/recommend", {
      watchedIds: watchedIds, // pass full array
    });

    if (response.data && Array.isArray(response.data)) {
      return res.status(200).json({ recommendedMovies: response.data });
    } else {
      return res.status(404).json({ message: "No recommendations found" });
    }
  } catch (error) {
    console.error("Error recommending movie:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};