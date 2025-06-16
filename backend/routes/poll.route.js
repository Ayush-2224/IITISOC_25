import { Router } from "express";
import { createPoll, increaseVote } from "../controllers/poll.controller.js";

const router = Router();

router.post("/create", createPoll);
router.post("/vote/:pollId", increaseVote);

export default router;
