import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye, FaCalendar, FaClock, FaBell, FaHistory, FaCheckCircle } from "react-icons/fa";

const UpcomingEvents = ({ events, userId, groupCreatorId, onDelete, joinEvent, leaveEvent, onEditEvent, joiningEvents, leavingEvents }) => {
  const navigate = useNavigate();
  
  // Sort all events by date (newest first) and take only the last 5
  const sortedEvents = events
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    .slice(0, 5);
  
  // Separate past and upcoming events from the sorted list
  const now = new Date();
  const upcomingEvents = sortedEvents.filter(event => new Date(event.dateTime) > now);
  const pastEvents = sortedEvents.filter(event => new Date(event.dateTime) <= now);
  
  const handleDelete = async (eventId) => {
    console.log(eventId);
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/events/delete/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          eventId, 
        },
      });
      onDelete(eventId); 
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event");
    }
  };

  const handleClick = (id) => {
    navigate(`/events/${id}`);
  };

  const handleEdit = (event) => {
    // Check if event is in the past
    if (new Date(event.dateTime) <= new Date()) {
      toast.error("Cannot edit past events");
      return;
    }
    
    if (onEditEvent) {
      onEditEvent(event);
    }
  };

  const handleJoinLeave = (event) => {
    // Check if event is in the past
    if (new Date(event.dateTime) <= new Date()) {
      toast.error("Cannot join or leave past events");
      return;
    }
    
    if (event.isParticipant) {
      leaveEvent(event._id);
    } else {
      joinEvent(event._id);
    }
  };

  const EventCard = ({ event, isPast = false }) => {
    const eventDate = new Date(event.dateTime);
    const isEventPast = eventDate <= now;

  return (
      <div
        className={`group relative p-6 backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-[1.02] ${
          isEventPast 
            ? 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
      >
        {/* Past Event Indicator */}
        {isEventPast && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-gray-700/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600/30">
            <FaHistory className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 text-xs font-medium">Past Event</span>
          </div>
        )}

        {/* Event Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className={`text-lg font-bold mb-2 ${
              isEventPast ? 'text-gray-400' : 'text-white'
            }`}>
              {event.title}
            </h4>
            {event.notes && (
              <p className={`text-sm mb-3 line-clamp-2 ${
                isEventPast ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {event.notes}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Edit Button - Only for event creator and not past events */}
            {event.isAdmin && !isEventPast && (
              <button
                onClick={() => handleEdit(event)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
                title="Edit Event"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            )}
            
            {/* Delete Button - Only for event creator and not past events */}
            {event.isAdmin && !isEventPast && (
              <button
                onClick={() => handleDelete(event._id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-110"
                title="Delete Event"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              isEventPast 
                ? 'bg-gray-600/20 border-gray-500/30' 
                : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30'
            }`}>
              <FaClock className={`w-4 h-4 ${
                isEventPast ? 'text-gray-500' : 'text-blue-400'
              }`} />
            </div>
            <div>
              <p className={`text-xs ${
                isEventPast ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Date & Time
              </p>
              <p className={`text-sm font-medium ${
                isEventPast ? 'text-gray-400' : 'text-gray-300'
              }`}>
                {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {event.reminder?.sendReminder && (
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                isEventPast 
                  ? 'bg-gray-600/20 border-gray-500/30' 
                  : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'
              }`}>
                <FaBell className={`w-4 h-4 ${
                  isEventPast ? 'text-gray-500' : 'text-orange-400'
                }`} />
              </div>
              <div>
                <p className={`text-xs ${
                  isEventPast ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Reminder
                </p>
                <p className={`text-sm font-medium ${
                  isEventPast ? 'text-gray-400' : 'text-gray-300'
                }`}>
                  {new Date(event.reminder.reminderTime).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Event Actions */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleClick(event._id)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300 hover:scale-105 ${
              isEventPast
                ? 'bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50 text-gray-400'
                : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white'
            }`}
          >
            <FaEye className="w-4 h-4" />
            <span className="text-sm font-medium">View Event</span>
          </button>

          {/* Join/Leave Button - Only for upcoming events */}
          {!event.isAdmin && !isEventPast && (
            <button
              onClick={() => handleJoinLeave(event)}
              disabled={joiningEvents.has(event._id) || leavingEvents.has(event._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${
                event.isParticipant
                  ? 'bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300'
                  : 'bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300'
              }`}
            >
              {joiningEvents.has(event._id) ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Joining...</span>
                </div>
              ) : leavingEvents.has(event._id) ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Leaving...</span>
                </div>
              ) : (
                event.isParticipant ? 'Leave Event' : 'Join Event'
              )}
            </button>
          )}

          {/* Past Event Status */}
          {!event.isAdmin && isEventPast && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700/30 border border-gray-600/30 rounded-lg">
              {event.isParticipant ? (
                <>
                  <FaCheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Attended</span>
                </>
              ) : (
                <>
                  <FaHistory className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Missed</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none ${
          isEventPast
            ? 'bg-gradient-to-r from-gray-500/0 via-gray-600/0 to-gray-700/0 group-hover:from-gray-500/5 group-hover:via-gray-600/3 group-hover:to-gray-700/5'
            : 'bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/3 group-hover:to-blue-500/5'
        }`}></div>
      </div>
    );
  };

  if (!events.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
          <FaCalendar className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-400">No events found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <FaCalendar className="w-5 h-5 text-purple-400" />
            <span>📅 Upcoming Events ({upcomingEvents.length})</span>
          </h3>
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <FaHistory className="w-5 h-5 text-gray-400" />
            <span>📚 Past Events ({pastEvents.length})</span>
          </h3>
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} isPast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
