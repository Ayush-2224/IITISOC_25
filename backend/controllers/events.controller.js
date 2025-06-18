import Event from "../models/event.model.js";
import HttpError from "../models/httperror.js";
import Group from "../models/groups.model.js";
import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";
const createEvent = async (req, res, next) =>{
    const {title, dateTime, notes, Group, reminderTime} = req.body;
    const userId = req.user.id;
    try{
        console.log(Group);
        
        const event = await Event.create({
            title,
            createdBy: userId,
            dateTime,
            notes,
            Group,
            reminder: {
                sendReminder: reminderTime ? true : false,
                reminderTime: reminderTime ? new Date(reminderTime) : null,
            },
        })
        console.log(event._id);
        
        res.status(201).json({
            message: "Event created successfully",
            event,
        })
    }catch(error){
        console.log(error);
        
        return next(new HttpError(error.message, 400));
    }
}

const getEvent = async (req, res, next) =>{
    const {eventId} = req.params;
    const userId = req.user.id;
    
    try{
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
        
        if(!event){
            
            return next(new HttpError("Event not found", 404));
        }
        const group = event.Group ? await Group.findById(event.Group) : null;
        if((event.createdBy._id.toString() !== userId.toString() && !group) || (group && !group.members.includes(userId))){

            return next(new HttpError("You are not authorized to view this event", 403));
        }
        res.status(200).json({
    event,
    allowEditing: event.createdBy._id.toString() === userId.toString()
});
    }catch(error){
        console.log(error);
        
        return next(new HttpError(error.message, 400));
    }
}

const getEventsbyUser = async (req, res, next) =>{
    const userId = req.user.id;
    try{
        const events = await Event.find({createdBy: userId}).select('-Group -notes -participants');
        res.status(200).json({
            message: "Events fetched successfully",
            events,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}
const getEventsbyGroup = async (req, res, next) =>{
    const userId = req.user.id;
    const GroupId = req.params.groupId;
    try{
        const group = await Group.find(GroupId, {members: userId}).select('-Group -notes -participants');
        if(!group){
            return next(new HttpError("Group not found or you are not a member of this group", 404));
        }
        const events = await Event.find({Group: GroupId});
        res.status(200).json({
            message: "Events fetched successfully",
            events
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const updateEvent = async (req, res, next) =>{
    const {eventId} = req.params;
    const {title, dateTime, notes, reminderTime} = req.body;
    const userId = req.user.id;
    try{
        const event = await Event.findById(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(event.createdBy.toString() !== userId.toString()){
            return next(new HttpError("You are not authorized to update this event", 403));
        }

        if(event.dateTime < new Date()){
            return next(new HttpError("You cannot update an event that has already passed", 400));
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
        console.log(error);
        
        return next(new HttpError(error.message, 400));
    }
}


const deleteEvent = async (req, res, next) =>{
    const {eventId} = req.params;
    const userId = req.user.id;
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

const joinEvent = async (req, res, next) =>{
    const userId = req.user.id;
    const {eventId} = req.params;
    try{
        const event = await Event.findById(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        const groupId = event.Group;
        const group = groupId ? await Group.findById(groupId) : null;

        if(!group){
            return next(new HttpError("This is a solo event", 404));
        }

        if((group && !group.members.includes(userId))){
            return next(new HttpError("You are not a member of this group", 403));
        }

        if(event.participants.includes(userId)){
            return next(new HttpError("You are already a participant of this event", 400));
        }
        event.participants.push(userId);
        await event.save();
        res.status(200).json({
            message: "You have joined the event successfully",
            event,
        })
    }catch(error){
        return next(new HttpError(error.message, 400));
    }
}

const leaveEvent = async (req, res, next) => {
    const userId = req.user.id;
    const {eventId} = req.params;
    try{
        const event = await Event.findById(eventId);
        if(!event){
            return next(new HttpError("Event not found", 404));
        }
        if(!event.participants.includes(userId)){
            return next(new HttpError("You are not a participant of this event", 400));
        }
        event.participants = event.participants.filter(participant => participant.toString() !== userId.toString());
        await event.save();
        res.status(200).json({
            message: "You have left the event successfully",
            event,
        });
    }
    catch(error){
        return next(new HttpError(error.message, 400));
    }
}

export {
    createEvent,
    getEventsbyUser,
    getEventsbyGroup,
    updateEvent,
    joinEvent,
    leaveEvent,
    deleteEvent, getEvent};