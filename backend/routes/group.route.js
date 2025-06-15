import express from "express";
import {
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  getAllGroups,
  addMember,
  removeMember,
} from "../controllers/group.controller.js";

const Grouprouter = express.Router();


Grouprouter.post("/create",createGroup ); // Create group
Grouprouter.get("/all", getAllGroups); // Get all groups
Grouprouter.get("/:id", getGroupById); // Get specific group
Grouprouter.put("/:id", updateGroup); // Update group
Grouprouter.delete("/:id", deleteGroup); // Delete group
Grouprouter.put("/:id/add-member", addMember); // Add member
Grouprouter.put("/:id/remove-member", removeMember); // Remove member

export default Grouprouter;
