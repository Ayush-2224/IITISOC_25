import { Router } from "express";
import fileUpload from '../config/multer.js'
const router = Router();
import { sendMessage,combinedFeed } from "../controllers/message.controller";

router.post("/send/:eventId", fileUpload.single("profilePic"), sendMessage);
router.get("/combined/:eventId", combinedFeed);

export default {router};