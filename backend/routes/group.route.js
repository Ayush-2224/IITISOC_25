import express from "express";
import {
  createGroup,
  joinGroup,
  getUserGroups,
  getGroupById,
  deleteGroup,
  recommendMovie
} from "../controllers/group.controller.js";

import authUser from "../middleware/auth.js";

const Grouprouter = express.Router();


Grouprouter.post("/create",authUser, createGroup);
Grouprouter.post("/join/:token",authUser, joinGroup);
Grouprouter.get("/user/:userId", authUser,getUserGroups);
Grouprouter.get("/:id", authUser,getGroupById); 
Grouprouter.delete("/delete/:id", authUser, deleteGroup);
Grouprouter.get("/recommendations/:groupId",authUser,recommendMovie)

export default Grouprouter;
