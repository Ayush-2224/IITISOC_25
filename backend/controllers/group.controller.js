import Group from "../models/groups.model.js";
 // optional, if needed for user checks
import crypto from "crypto";

// Create Group
export const createGroup = async (req, res) => {
  try {
    console.log("Body received:", req.body);

    const { name, createdBy, eventDate, location, notes, watchlist } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inviteToken = crypto.randomBytes(16).toString("hex");
    console.log("Generated invite token:", inviteToken);

    const group = new Group({
      name,
      createdBy,
      eventDate,
      location,
      notes,
      inviteToken,
      watchlist,
      members: [createdBy],
    });

    await group.save();

    console.log("Group saved successfully:", group);
    res.status(201).json(group);

  } catch (err) {
    console.error("Create group error:", err); // Add this line
    res.status(500).json({ error: err.message });
  }
};


// Get Group by ID
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("watchlist");

    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Group
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Group
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Member to Group
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove Member from Group
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.members = group.members.filter((id) => id.toString() !== userId);
    await group.save();

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Groups (optional: filtered by creator)
export const getAllGroups = async (req, res) => {
  try {
    const filter = req.query.createdBy ? { createdBy: req.query.createdBy } : {};
    const groups = await Group.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
