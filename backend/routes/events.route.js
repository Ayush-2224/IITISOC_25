import { Router } from "express";
import authUser from "../middleware/auth.js";
import { createEvent, getEventsbyUser, updateEvent, joinEvent, deleteEvent, getEventsbyGroup, leaveEvent, getEvent } from "../controllers/events.controller.js";

const router = Router();

router.post("/create", authUser, createEvent);
router.get("/get/:eventId", authUser, getEvent); // Assuming this is to get a specific event by ID
router.get("/getUser", authUser, getEventsbyUser);
router.get("/getGroup/:groupId", authUser, getEventsbyGroup);
router.put("/update/:eventId", authUser, updateEvent);
router.post("/join/:eventId", authUser, joinEvent);
router.post("/leave/:eventId", authUser, leaveEvent);
router.delete("/delete/:eventId", authUser, deleteEvent);

export default router;