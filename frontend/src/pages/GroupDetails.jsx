import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UpcomingEvents from "../components/UpcomingEvents.jsx";
import { FaUsers, FaCopy, FaComments, FaPlus, FaUserCheck, FaUserTimes, FaCrown, FaCalendarAlt, FaEdit, FaClock, FaBell, FaSave, FaTimes, FaCalendar, FaSignOutAlt, FaTrash } from "react-icons/fa";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  
  // Event editing state
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    dateTime: "",
    notes: "",
    sendReminder: false,
    reminderTime: "",
  });

  const [showAllMembers, setShowAllMembers] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setGroup(res.data);
        setLoading(false);
      } catch (err) {
        // console.error("Error fetching group:", err);
        setError("Failed to load group details.");
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/events/getGroup/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching group events:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      setRecLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/group/recommendations/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecommendations(res.data.recommendedMovies || res.data); // support both formats
      } catch (err) {
        setRecommendations([]);
      } finally {
        setRecLoading(false);
      }
    };

    fetchGroup();
    fetchEvents();
    if (groupId && token) fetchRecommendations();
  }, [groupId, token]);

  const joinEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/events/join/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e._id === eventId ? { ...e, isParticipant: true } : e
        )
      );
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error("Failed to join event");
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/events/leave/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e._id === eventId ? { ...e, isParticipant: false } : e
        )
      );
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error leaving event:", err);
      toast.error("Failed to leave event");
    }
  };

  const copyInviteToken = () => {
    navigator.clipboard.writeText(group.inviteToken);
    setCopied(true);
    toast.success("Invite token copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  // Leave group function
  const leaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      const response = await axios.post(
        `http://localhost:4000/api/group/leave/${groupId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(response.data.message);
      navigate("/groups");
    } catch (err) {
      console.error("Error leaving group:", err);
      toast.error(err.response?.data?.message || "Failed to leave group");
    }
  };

  // Delete group function (only for creator)
  const deleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/group/delete/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(response.data.message);
      navigate("/groups");
    } catch (err) {
      console.error("Error deleting group:", err);
      toast.error(err.response?.data?.message || "Failed to delete group");
    }
  };

  // Event editing functions
  const openEditModal = (event) => {
    setEditingEvent(event);
    
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEditFormData({
      title: event.title,
      dateTime: formatDateForInput(event.dateTime),
      notes: event.notes || "",
      sendReminder: event.reminder?.sendReminder || false,
      reminderTime: event.reminder?.reminderTime
        ? formatDateForInput(event.reminder.reminderTime)
        : "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setEditFormData({
      title: "",
      dateTime: "",
      notes: "",
      sendReminder: false,
      reminderTime: "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    if (!editingEvent) return;

    // Validate reminder time if reminder is enabled
    if (editFormData.sendReminder && !editFormData.reminderTime) {
      toast.error("Please set a reminder time when reminder is enabled");
      return;
    }

    try {
      const updatedEvent = {
        title: editFormData.title.trim(),
        dateTime: new Date(editFormData.dateTime).toISOString(),
        notes: editFormData.notes.trim(),
        reminder: {
          sendReminder: editFormData.sendReminder,
          reminderTime: editFormData.sendReminder && editFormData.reminderTime
            ? new Date(editFormData.reminderTime).toISOString()
            : null,
        },
      };

      console.log("Sending update request:", updatedEvent);

      await axios.put(
        `http://localhost:4000/api/events/update/${editingEvent._id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Event updated successfully!");
      closeEditModal();
      
      // Refresh events to show updated data
      const res = await axios.get(
        `http://localhost:4000/api/events/getGroup/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents(res.data.events);
    } catch (err) {
      console.error("Error updating event:", err);
      toast.error(err.response?.data?.message || "Failed to update event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error loading group</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">👥</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">⭐</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              {group.name}
            </h1>
          </div>
          {group.description && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {group.description}
            </p>
          )}
        </div>

        {/* Action Buttons (always show Join Discussion, show Create Event only for admin) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Link
            to={`/discussion/${groupId}`}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-3"
          >
            <FaComments className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Join Discussion</span>
          </Link>
          {group?.createdBy?._id === userId && (
            <Link
              to={`/events/create/${groupId}`}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-3"
            >
              <FaCalendarAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Create Event</span>
            </Link>
          )}
        </div>

        {/* Invite Token Section (always visible) */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-green-400">🔗</span>
            <span>Invite Friends</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">Invite Token:</p>
              <code className="text-purple-300 font-mono text-lg">{group.inviteToken}</code>
            </div>
            <button
              onClick={copyInviteToken}
              className={`group px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 ${
                copied 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <FaCopy className="w-4 h-4 text-white" />
              <span className="text-white font-medium">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <FaUsers className="w-6 h-6 text-indigo-400" />
            <span>Members ({group.members?.length || 0})</span>
          </h3>
          {group.members?.length > 0 ? (
            <>
              <div className={
                showAllMembers
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              }>
                {(showAllMembers ? group.members : group.members.slice(0, 5)).map((member) => (
                  <div
                    key={member._id}
                    className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.profilePic || "https://via.placeholder.com/40x40?text=👤&bg=1a1a1a&color=666666"}
                        alt={member.name}
                        className="w-12 h-12 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/40x40?text=👤&bg=1a1a1a&color=666666";
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium flex items-center space-x-2">
                          <span>{member.name || member.email || "Anonymous"}</span>
                          {member._id === group?.createdBy?._id && (
                            <FaCrown className="w-3 h-3 text-yellow-400" title="Group Creator" />
                          )}
                        </p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {group.members.length > 5 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAllMembers((prev) => !prev)}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    {showAllMembers ? "Collapse" : `Show All (${group.members.length})`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="w-12 h-12 text-gray-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-300 mb-2">No members yet</h4>
              <p className="text-gray-500">Share the invite token to grow your group!</p>
            </div>
          )}
        </div>

        {/* Group Management Buttons */}
        <div className="mb-8 flex justify-center">
          {group?.createdBy?._id === userId ? (
            // Creator can delete the group
            <button
              onClick={deleteGroup}
              className="group bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-3"
            >
              <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Delete Group</span>
            </button>
          ) : (
            // Members can leave the group
            <button
              onClick={leaveGroup}
              className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center space-x-3"
            >
              <FaSignOutAlt className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Leave Group</span>
            </button>
          )}
        </div>

        {/* Recommended Movies Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <span>🎬</span>
            <span>Recommended Movies</span>
          </h3>
          {recLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendations.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group block bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                    alt={movie.title}
                    className="w-full h-60 object-cover object-center group-hover:opacity-90 transition-all duration-300"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-white truncate" title={movie.title}>{movie.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 py-8 text-center">No recommendations found for this group yet.</div>
          )}
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <UpcomingEvents
            events={events}
            userId={localStorage.getItem("userId")}
            groupCreatorId={group?.createdBy?._id}
            onDelete={(deletedId) =>
              setEvents((prev) => prev.filter((e) => e._id !== deletedId))
            }
            joinEvent={joinEvent}
            leaveEvent={leaveEvent}
            onEditEvent={openEditModal}
          />
        </div>

        {/* Group Stats */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <span className="text-blue-400">📊</span>
            <span>Group Statistics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {group.members?.length || 0}
              </div>
              <p className="text-gray-400 text-sm">Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {events.length}
              </div>
              <p className="text-gray-400 text-sm">Events</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {events.filter(e => new Date(e.dateTime) > new Date()).length}
              </div>
              <p className="text-gray-400 text-sm">Upcoming</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {Math.round(Math.random() * 30) + 85}%
              </div>
              <p className="text-gray-400 text-sm">Activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FaEdit className="w-6 h-6 text-purple-400" />
                <span>Edit Event</span>
              </h2>
              <button
                onClick={closeEditModal}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <FaTimes className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <FaCalendar className="w-4 h-4 text-purple-400" />
                  <span>Event Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <FaClock className="w-4 h-4 text-blue-400" />
                  <span>Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={editFormData.dateTime}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📝 Event Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditFormChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Add any special instructions, themes, or details about your event..."
                />
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    name="sendReminder"
                    id="sendReminder"
                    checked={editFormData.sendReminder}
                    onChange={handleEditFormChange}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="sendReminder" className="text-gray-300 flex items-center space-x-2">
                    <FaBell className="w-4 h-4 text-orange-400" />
                    <span>Send reminder notification</span>
                  </label>
                </div>

                {editFormData.sendReminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="datetime-local"
                      name="reminderTime"
                      value={editFormData.reminderTime}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                >
                  <FaSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
