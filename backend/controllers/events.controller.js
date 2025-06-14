import Event from "../models/event.model";
import HttpError from "../models/httperror";

const createEvent = async (req, res, next) =>{
    const {title, dateTime, notes, invitedEmails, reminderTime} = req.body;
    const userId = req.user._id;
    try{

        const event = await Event.create({
            title,
            createdBy: userId,
            dateTime,
            notes,
            invitedEmails,
            reminder: {
                sendReminder: reminderTime ? true : false,
                reminderTime: reminderTime ? new Date(reminderTime) : null,
            },
        })

        res.status(201).json({
            message: "Event created successfully",
            event,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const getEvents = async (req, res, next) =>{
    const userId = req.user._id;
    try{
        const events = await Event.find({createdBy: userId});
        res.status(200).json({
            message: "Events fetched successfully",
            events,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const updateEvent = async (req, res, next) =>{
    const {eventId} = req.params;
    const {title, dateTime, notes, invitedEmails, reminderTime} = req.body;
    const userId = req.user._id;
    try{
        const event = await Event.findOne(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(event.createdBy.toString() !== userId.toString()){
            return next(new HttpError("You are not authorized to update this event", 403));
        }
        if(title){
            event.title = title;
        }
        if(dateTime){
            event.dateTime = dateTime;
        }
        if(notes){
            event.notes = notes;
        }
        if(invitedEmails){
            event.invitedEmails = invitedEmails;
        }
        if(reminderTime){
            event.reminder.sendReminder =  true;
            event.reminder.reminderTime =  new Date(reminderTime);
        }
        await event.save();
        res.status(200).json({
            message: "Event updated successfully",
            event,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const addEventInvitees = async (req, res, next) =>{
    const {eventId} = req.params;
    const {invitedEmails} = req.body;
    const userId = req.user._id;
    try{
        const event = await Event.findOne(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(event.createdBy.toString() !== userId.toString()){
            return next(new HttpError("You are not authorized to add invitees to this event", 403));
        }
        event.invitedEmails.push(...invitedEmails);
        await event.save();
        res.status(200).json({
            message: "Invitees added successfully",
            event,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const deleteEvent = async (req, res, next) =>{
    const {eventId} = req.params;
    const userId = req.user._id;
    try{
        const event = await Event.findOne(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(event.createdBy.toString() !== userId.toString()){
            return next(new HttpError("You are not authorized to delete this event", 403));
        }
        await event.deleteOne();
        res.status(200).json({
            message: "Event deleted successfully",
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const deleteEventInvitee = async (req, res, next) =>{
    const {eventId} = req.params;
    const {email} = req.body;
    const userId = req.user._id;
    try{
        const event = await Event.findOne(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(event.createdBy.toString() !== userId.toString()){
            return next(new HttpError("You are not authorized to delete invitees from this event", 403));
        }
        event.invitedEmails = event.invitedEmails.filter(invitedEmail => invitedEmail.toString() !== email.toString());
        await event.save();
        res.status(200).json({
            message: "Invitees deleted successfully",
            event
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}