import { Router } from "express";
import fileUpload from "../config/multer.js";
import { sendMessage, combinedFeed } from "../controllers/message.controller.js";

const router = Router();

router.post("/send/:eventId", fileUpload.single("profilePic"), sendMessage);
router.get("/combined/:eventId", combinedFeed);

export default router;
