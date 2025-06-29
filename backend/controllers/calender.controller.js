import { getCalendarClient } from "../config/googleCalender.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";

/**
 * Creates a Google Calendar event for a user
 * @param {Object} user - User object with googleRefreshToken
 * @param {Object} event - Event object
 * @param {string} requestId - Unique request ID for the calendar event
 * @returns {Promise<Object>} Google Calendar response
 */
export const createGoogleCalendarEvent = async (user, event, requestId) => {
    if (!user.googleRefreshToken || !event.reminder.sendReminder) {
        throw new Error('Google Calendar not linked or reminder not enabled');
    }

    const calendar = getCalendarClient(user);
    
    // Calculate reminder time in minutes before event
    const reminderTimeDiff = Math.round((event.dateTime.getTime() - event.reminder.reminderTime.getTime()) / (1000 * 60));

    const gRes = await calendar.events.insert({
        calendarId: 'primary',
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        requestBody: {
            summary: event.title,
            description: event.notes || `Event: ${event.title}`,
            start: {
                dateTime: event.dateTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            end: {
                dateTime: new Date(
                    event.dateTime.getTime() + 60 * 60_000 // 1 hour duration
                ).toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            attendees: [{ email: user.email }],
            reminders: { 
                useDefault: false, 
                overrides: [
                    { method: 'popup', minutes: reminderTimeDiff },
                    { method: 'email', minutes: 60 }
                ] 
            },
            conferenceData: { createRequest: { requestId } }
        }
    });

    return gRes;
};

/**
 * Updates a Google Calendar event for a user
 * @param {Object} user - User object with googleRefreshToken
 * @param {Object} event - Updated event object
 * @param {string} eventId - Google Calendar event ID
 * @returns {Promise<Object>} Google Calendar response
 */
export const updateGoogleCalendarEvent = async (user, event, eventId) => {
    if (!user.googleRefreshToken || !event.reminder.sendReminder) {
        throw new Error('Google Calendar not linked or reminder not enabled');
    }

    const calendar = getCalendarClient(user);
    
    // Calculate reminder time in minutes before event
    const reminderTimeDiff = Math.round((event.dateTime.getTime() - event.reminder.reminderTime.getTime()) / (1000 * 60));

    const gRes = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
        requestBody: {
            summary: event.title,
            description: event.notes || `Event: ${event.title}`,
            start: {
                dateTime: event.dateTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            end: {
                dateTime: new Date(
                    event.dateTime.getTime() + 60 * 60_000 // 1 hour duration
                ).toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            attendees: [{ email: user.email }],
            reminders: { 
                useDefault: false, 
                overrides: [
                    { method: 'popup', minutes: reminderTimeDiff },
                    { method: 'email', minutes: 60 }
                ] 
            }
        }
    });

    return gRes;
};

/**
 * Deletes a Google Calendar event for a user
 * @param {Object} user - User object with googleRefreshToken
 * @param {string} eventId - Google Calendar event ID
 * @returns {Promise<Object>} Google Calendar response
 */
export const deleteGoogleCalendarEvent = async (user, eventId) => {
    if (!user.googleRefreshToken) {
        throw new Error('Google Calendar not linked');
    }

    const calendar = getCalendarClient(user);
    
    const gRes = await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all'
    });

    return gRes;
};

/**
 * Updates Google Calendar events for all participants of an event
 * @param {Object} event - Event object
 * @param {Object} oldReminder - Previous reminder settings
 * @returns {Promise<void>}
 */
export const updateAllParticipantsCalendarEvents = async (event, oldReminder) => {
    if (!event.googleEventIds || Object.keys(event.googleEventIds).length === 0) {
        return;
    }

    const reminderChanged = oldReminder.sendReminder !== event.reminder.sendReminder || 
                          (oldReminder.reminderTime && event.reminder.reminderTime && 
                           oldReminder.reminderTime.getTime() !== event.reminder.reminderTime.getTime());
    
    if (!reminderChanged) {
        return;
    }

    // Get all participants with their user data
    const participants = await User.find({ 
        _id: { $in: event.participants } 
    }).select('+googleRefreshToken');
    
    for (const participant of participants) {
        const gId = event.googleEventIds.get(participant._id.toString());
        if (gId && participant.googleRefreshToken) {
            try {
                if (event.reminder.sendReminder) {
                    // Update existing event
                    await updateGoogleCalendarEvent(participant, event, gId);
                } else {
                    // Remove event if reminder is disabled
                    await deleteGoogleCalendarEvent(participant, gId);
                    
                    // Remove mapping
                    await Event.updateOne(
                        { _id: event._id },
                        { $unset: { [`googleEventIds.${participant._id}`]: 1 } }
                    );
                }
            } catch (error) {
                console.error(`Google Calendar update failed for user ${participant._id}:`, error.message);
                // Continue with other participants even if one fails
            }
        }
    }
};

/**
 * Deletes Google Calendar events for all participants of an event
 * @param {Object} event - Event object
 * @returns {Promise<void>}
 */
export const deleteAllParticipantsCalendarEvents = async (event) => {
    if (!event.googleEventIds || Object.keys(event.googleEventIds).length === 0) {
        return;
    }

    const participants = await User.find({ 
        _id: { $in: event.participants } 
    }).select('+googleRefreshToken');
    
    for (const participant of participants) {
        const gId = event.googleEventIds.get(participant._id.toString());
        if (gId && participant.googleRefreshToken) {
            try {
                await deleteGoogleCalendarEvent(participant, gId);
            } catch (error) {
                console.error(`Google Calendar delete failed for user ${participant._id}:`, error.message);
                // Continue with other participants even if one fails
            }
        }
    }
};
