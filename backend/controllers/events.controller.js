import Event from "../models/event.model.js";
import HttpError from "../models/httperror.js";
import Group from "../models/groups.model.js";
import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";
import History from "../models/history.model.js";
import { now } from "mongoose";
import { getCalendarClient } from "../config/googleCalender.js";
import { 
    createGoogleCalendarEvent, 
    updateGoogleCalendarEvent, 
    deleteGoogleCalendarEvent,
    updateAllParticipantsCalendarEvents,
    deleteAllParticipantsCalendarEvents
} from "./calender.controller.js";
import axios from "axios";


const createEvent = async (req, res, next) => {
    const { title, dateTime, notes, Group, reminder } = req.body;
    const userId = req.user.id;
    try {
        const event = await Event.create({
            title,
            createdBy: userId,
            dateTime,
            notes,
            Group,
            reminder: {
                sendReminder: reminder?.sendReminder || false,
                reminderTime: reminder?.sendReminder && reminder?.reminderTime 
                    ? new Date(reminder.reminderTime) 
                    : null,
            },
        })
        
        if (event.reminder.sendReminder && req.user.googleRefreshToken) {
            try {
                const gRes = await createGoogleCalendarEvent(req.user, event, event._id.toString());
                
                await Event.updateOne(
                    { _id: event._id },
                    { $set: { [`googleEventIds.${req.user._id}`]: gRes.data.id } }
                );
            } catch (gErr) {
                console.error('Google Calendar insert for creator failed:', gErr.message);
                // Don't block event creation; you can surface a warning if you wish.
            }
        }

        res.status(201).json({
            message: "Event created successfully",
            event,
        })
    } catch (error) {
        console.log(error);

        return next(new HttpError(error.message, 400));
    }
}

const getEvent = async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    console.log("event Id;", eventId)

    try {
        const event = await Event.findById(eventId)
            .populate({
                path: 'participants',
                select: 'name profilePic'
            })
            .populate({
                path: 'suggestedMovies',
                select: 'title posterUrl rating year genres'
            }).populate({
                path: 'createdBy',
                select: 'name profilePic'
            });

        if (!event) {

            return next(new HttpError("Event not found", 404));
        }
        const group = event.Group ? await Group.findById(event.Group) : null;
        if ((event.createdBy._id.toString() !== userId.toString() && !group) || (group && !group.members.includes(userId))) {

            return next(new HttpError("You are not authorized to view this event", 403));
        }
        res.status(200).json({
            event,
            allowEditing: event.createdBy._id.toString() === userId.toString()
        });
    } catch (error) {
        console.log(error);

        return next(new HttpError(error.message, 400));
    }
}

const getEventsbyUser = async (req, res, next) => {
    const userId = req.user.id;
    console.log("userid", userId);
    try {
        const events = await Event.find({ createdBy: userId }).select('-Group -notes -participants');
        res.status(200).json({
            message: "Events fetched successfully",
            events,
        })
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
}
const getEventsbyGroup = async (req, res, next) => {
    //console.log(req)
    const userId = req.user.id;
    const GroupId = req.params.groupId;
    console.log(userId)
    console.log(GroupId)
    try {
        const group = await Group.findOne({ _id: GroupId, members: userId }); 
        if (!group) {
            console.log("group not found or you are not a member of this group")
            return next(new HttpError("Group not found or you are not a member of this group", 404));
        }
        const events = await Event.find({ Group: GroupId });
        const eventsWithParticipantStatus = events.map(event => {
            return {
                ...event.toObject(),
                isParticipant: event.participants.includes(userId),
                isAdmin: event.createdBy.toString() === userId.toString()
            };
        });
        // console.log(eventsWithParticipantStatus);
        
        res.status(200).json({
            message: "Events fetched successfully",
            events: eventsWithParticipantStatus
        })
    } catch (error) {
        console.log(error);
        return next(new HttpError(error.message, 400));
    }
}

const getPastEventsbyGroup = async (req, res, next) => {
    const userId = req.user.id;
    const GroupId = req.params.groupId;
    try {
        const group = await Group.findOne({ _id: GroupId, members: userId }); 
        if (!group) {
            return next(new HttpError("Group not found or you are not a member of this group", 404));
        }
        
        const now = new Date();
        const pastEvents = await Event.find({ 
            Group: GroupId,
            dateTime: { $lt: now }
        }).sort({ dateTime: -1 }); // Sort by most recent first
        
        const eventsWithParticipantStatus = pastEvents.map(event => {
            return {
                ...event.toObject(),
                isParticipant: event.participants.includes(userId),
                isAdmin: event.createdBy.toString() === userId.toString()
            };
        });
        
        res.status(200).json({
            message: "Past events fetched successfully",
            events: eventsWithParticipantStatus
        })
    } catch (error) {
        console.log(error);
        return next(new HttpError(error.message, 400));
    }
}

const updateEvent = async (req, res, next) => {
    const { eventId } = req.params;
    const { title, dateTime, notes, reminder } = req.body;
    const userId = req.user.id;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new HttpError("Event not found", 404));
        }
        if (event.createdBy.toString() !== userId.toString()) {
            return next(new HttpError("You are not authorized to update this event", 403));
        }

        if (event.dateTime < new Date()) {
            return next(new HttpError("You cannot update an event that has already passed", 400));
        }
        
        // Store old reminder settings for comparison
        const oldReminder = { ...event.reminder };
        
        if (title) {
            event.title = title;
        }
        if (dateTime) {
            event.dateTime = dateTime;
        }
        if (notes !== undefined) {
            event.notes = notes;
        }
        
        // Always update reminder object
        if (reminder !== undefined) {
            event.reminder = {
                sendReminder: !!reminder.sendReminder,
                reminderTime: reminder.sendReminder && reminder.reminderTime
                    ? new Date(reminder.reminderTime)
                    : null,
            };
        }
        
        // Handle Google Calendar updates for all participants
        await updateAllParticipantsCalendarEvents(event, oldReminder);
        
        await event.save();
        res.status(200).json({
            message: "Event updated successfully",
            event,
        })
    } catch (error) {
        console.log(error);

        return next(new HttpError(error.message, 400));
    }
}


const deleteEvent = async (req, res) => {
    const eventId = req.body.eventId;
    const userId = req.user.id;
    console.log(eventId)

    try {
        const event = await Event.findById(eventId).populate("Group");
        if (!event) return res.status(404).json({ message: "Event not found" });

        const group = await Group.findById(event.Group);
        if (!group || group.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete" });
        }

        // Remove all Google Calendar events for all participants
        await deleteAllParticipantsCalendarEvents(event);

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const joinEvent = async (req, res, next) => {
    const userId = req.user.id;
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new HttpError("Event not found", 404));
        }
        
        // Check if event has already passed
        if (event.dateTime < new Date()) {
            return next(new HttpError("Cannot join an event that has already passed", 400));
        }
        
        const groupId = event.Group;
        const group = groupId ? await Group.findById(groupId) : null;

        if (!group) {
            return next(new HttpError("This is a solo event", 404));
        }

        if ((group && !group.members.includes(userId))) {
            return next(new HttpError("You are not a member of this group", 403));
        }

        if (event.participants.includes(userId)) {
            return next(new HttpError("You are already a participant of this event", 400));
        }
        
        event.participants.push(userId);
        
        // Google Calendar integration for joining event
        if (req.user.googleRefreshToken && event.reminder.sendReminder) {
            try {
                const gRes = await createGoogleCalendarEvent(req.user, event, `${event._id}_${req.user._id}`);
                
                // Store the Google Calendar event ID
                await Event.updateOne(
                    { _id: event._id },
                    { $set: { [`googleEventIds.${req.user._id}`]: gRes.data.id } }
                );
            } catch (error) {
                console.error("Error creating Google Calendar event:", error.message);
                // Don't block the join operation if Google Calendar fails
            }
        }
        
        await event.save();
        res.status(200).json({
            message: "You have joined the event successfully",
            event,
        })
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
}
// creator leaves then what happens?
const leaveEvent = async (req, res, next) => {
    const userId = req.user.id;
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new HttpError("Event not found", 404));
        }
        
        // Check if event has already passed
        if (event.dateTime < new Date()) {
            return next(new HttpError("Cannot leave an event that has already passed", 400));
        }
        
        if (!event.participants || !event.participants.some(p => p.toString() === userId.toString())) {
            return next(new HttpError("You are not a participant of this event", 400));
        }

        event.participants = event.participants.filter(participant => participant.toString() !== userId.toString());
        
        // Google Calendar integration for leaving event
        if (req.user.googleRefreshToken) {
            const gId = event.googleEventIds?.get(req.user._id.toString());
            if (gId) {
                try {
                    await deleteGoogleCalendarEvent(req.user, gId);
                    
                    // Remove mapping
                    await Event.updateOne(
                        { _id: event._id },
                        { $unset: { [`googleEventIds.${req.user._id}`]: 1 } }
                    );
                } catch (gErr) {
                    console.error('Google Calendar delete failed:', gErr.message);
                    // Continue with the leave operation even if Google Calendar fails
                }
            }
        }
          
        await event.save();
        res.status(200).json({
            message: "You have left the event successfully",
            event,
        });
    }
    catch (error) {
        return next(new HttpError(error.message, 400));
    }
}
const addMovieTOEvent = async (req, res, next) => {
    try {
      const { movieId, eventId } = req.body;
      const userId = req.user.id;
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      // Check if user is a participant of this event
      if (!event.participants || !event.participants.some(p => p.toString() === userId.toString())) {
        return res.status(403).json({ 
          success: false, 
          message: "Only event participants can add movies to this event" 
        });
      }
  
      if (!event.suggestedMovies.includes(movieId)) {
        event.suggestedMovies.push(movieId);
      }
  
      if (event.Group) {
        await History.create({
          group: event.Group,
          event: event._id,
          watchedMovie: movieId,
          watchedOn: new Date()
        });
        
        // Clear recommendation cache to ensure fresh recommendations
        try {
          await axios.post("http://localhost:5000/clear-cache");
        } catch (cacheError) {
          console.error("Failed to clear recommendation cache:", cacheError.message);
          // Don't fail the operation if cache clearing fails
        }
      }
  
      await event.save();
  
      return res.status(200).json({
        success: true,
        message: "Movie added to event successfully",
        event,
      });
  
    } catch (error) {
      console.error("Error adding movie to event:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  
const removeMovieFromEvent = async (req, res, next) => {
    console.log(req.body)
    console.log("called")
    try {
      const { movieId, eventId } = req.body;
      const userId = req.user.id;
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      // Check if user is a participant of this event
      if (!event.participants || !event.participants.some(p => p.toString() === userId.toString())) {
        return res.status(403).json({ 
          success: false, 
          message: "Only event participants can remove movies from this event" 
        });
      }
  
      if (!event.suggestedMovies.includes(movieId)) {
        return res.status(400).json({ success: false, message: "Movie not found in event" });
      }
  
      event.suggestedMovies = event.suggestedMovies.filter(id => id !== movieId);
      await event.save();
  
      return res.status(200).json({
        success: true,
        message: "Movie removed from event successfully",
        event,
      });
  
    } catch (error) {
      console.error("Error removing movie from event:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  

export {
    createEvent,
    getEvent,
    getEventsbyUser,
    getEventsbyGroup,
    getPastEventsbyGroup,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    addMovieTOEvent,
    removeMovieFromEvent
};