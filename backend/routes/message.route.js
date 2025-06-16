import { Router } from "express";
import fileUpload from "../config/multer.js";
import { sendMessage, combinedFeed } from "../controllers/message.controller.js";

const router = Router();

router.post("/send/:groupId", fileUpload.single("profilePic"), sendMessage);
router.get("/combined/:groupId", combinedFeed);

export default router;
