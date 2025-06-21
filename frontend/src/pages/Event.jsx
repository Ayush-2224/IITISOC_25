import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Event = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    notes: "",
    sendReminder: false,
    reminderTime: "",
  });
  const [allowedToEdit, setAllowedToEdit] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/get/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvent(response.data.event);
        setAllowedToEdit(response.data.allowEditing);
        setFormData({
          title: response.data.event.title,
          dateTime: response.data.event.dateTime.slice(0, 16),
          notes: response.data.event.notes,
          sendReminder: response.data.event.reminder?.sendReminder || false,
          reminderTime: response.data.event.reminder?.reminderTime
            ? response.data.event.reminder.reminderTime.slice(0, 16)
            : "",
        });
      } catch (err) {
        setError("Failed to fetch event details");
        toast.error(
          err.response?.data?.message || "Failed to fetch event details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        title: formData.title.trim(),
        dateTime: new Date(formData.dateTime).toISOString(),
        notes: formData.notes.trim(),
        reminder: {
          sendReminder: formData.sendReminder,
          reminderTime: formData.sendReminder
            ? new Date(formData.reminderTime).toISOString()
            : null,
        },
      };

      await axios.put(
        `http://localhost:4000/api/events/update/${eventId}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Event updated successfully");
      setIsEditing(false);
      setEvent((prev) => ({ ...prev, ...updatedEvent }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    }
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (!event)
    return (
      <div className="text-red-500 text-center mt-10">Event not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      {!isEditing ? (
        <>
          <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
          <p className="text-gray-400 mb-1">
            <strong>Created by:</strong> {event.createdBy.name}
          </p>
          <img
            src={event.createdBy.profilePic}
            alt="creator"
            className="w-16 h-16 rounded-full mb-4"
          />
          <p className="text-gray-400 mb-2">
            <strong>Group:</strong> {event.Group || "N/A"}
          </p>
          <p className="text-gray-400 mb-2">
            <strong>Date & Time:</strong>{" "}
            {new Date(event.dateTime).toLocaleString()}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Notes:</strong> {event.notes}
          </p>
          <p className="text-gray-400 mb-4">
            <strong>Reminder:</strong>{" "}
            {event.reminder?.sendReminder
              ? `Set for ${new Date(
                event.reminder.reminderTime
              ).toLocaleString()}`
              : "No reminder set"}
          </p>

          {new Date(event.dateTime) > new Date() && allowedToEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
            >
              ✏️ Edit Event
            </button>
          )}

          {/* Participants */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-3">👥 Participants</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {event.participants.map((p) => (
                <div
                  key={p._id}
                  className="text-center bg-gray-800 p-4 rounded-lg"
                >
                  <img
                    src={p.profilePic}
                    alt={p.name}
                    className="w-20 h-20 mx-auto rounded-full mb-2"
                  />
                  <p>{p.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Movies */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-3">🎬 Suggested Movies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {event.suggestedMovies.map((m, i) => (
                <div key={m._id || i} className="bg-gray-800 p-4 rounded-lg">
                  <img
                    src={m.posterUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={m.title || "No Title"}
                    className="w-full h-60 object-cover rounded mb-2"
                  />
                  <h4 className="font-bold">
                    {m.title || "Untitled"} {m.year ? `(${m.year})` : ""}
                  </h4>
                  <p className="text-sm">⭐ {m.rating || "N/A"}</p>
                  <p className="text-sm text-gray-400">
                    {Array.isArray(m.genres) ? m.genres.join(", ") : "No genres"}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendReminder"
              checked={formData.sendReminder}
              onChange={handleChange}
            />
            <label>Send Reminder</label>
          </div>
          {formData.sendReminder && (
            <div>
              <label className="block mb-1">Reminder Time</label>
              <input
                type="datetime-local"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Event;
