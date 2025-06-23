import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const UpcomingEvents = ({ events, userId, groupCreatorId, onDelete,  joinEvent, leaveEvent}) => {
  const navigate = useNavigate();
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
      alert("Failed to delete event");
    }
  };

  const handleClick = (id) => {
    navigate(`/events/${id}`);
  };
  if (!events.length) {
    return <p className="text-gray-400 mt-4">No upcoming events.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">📅 Upcoming Events</h3>
      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event._id}
            className="p-4 bg-gray-800 rounded shadow relative"
          >
            <h4 className="text-lg font-bold">{event.title}</h4>
            <p className="text-gray-300">{event.description}</p>
            <p className="text-sm text-gray-400">
              📍 {event.location || "Online"}
            </p>
            <p className="text-sm text-gray-400">
              🕒 {new Date(event.dateTime).toLocaleString()}
            </p>

            {event.isAdmin === groupCreatorId && (
              <button
                onClick={() => handleDelete(event._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete Event"
              >
                ❌
              </button>
            )}
            <button onClick={() => handleClick(event._id)}>View Event</button>
            {!event.isAdmin && (event.isParticipant ? <button className="cursor-pointer" onClick={() => leaveEvent(event._id)}>LEAVE</button> : 
            <button onClick={() => joinEvent(event._id)} className="cursor-pointer">JOIN</button>)
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
