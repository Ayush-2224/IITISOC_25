import { Router } from "express";
import authUser from "../middleware/auth";
import { createEvent, getEvents, updateEvent, addEventInvitees, deleteEvent, deleteEventInvitee } from "../controllers/events.controller";

const router = Router();

router.post("/create", authUser, createEvent);
router.get("/get", authUser, getEvents);
router.put("/update/:eventId", authUser, updateEvent);
router.post("/add-invitees/:eventId", authUser, addEventInvitees);
router.delete("/delete/:eventId", authUser, deleteEvent);
router.delete("/delete-invitee/:eventId", authUser, deleteEventInvitee);

export default router;