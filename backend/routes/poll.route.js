import { Router } from "express";

const router = Router();
import { createPoll,increaseVote } from "../controllers/poll.controller";

router.post("/create", createPoll);
router.post("/vote/:pollId", increaseVote);

export default{ router};
