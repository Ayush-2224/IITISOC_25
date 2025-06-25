import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaUsers, FaCrown, FaPlus, FaEye, FaEdit, FaCalendar, FaClock, FaBell, FaSave, FaTimes, FaSignOutAlt } from "react-icons/fa";

const Groups = () => {
  const userId = localStorage.getItem("userId");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem("token"));
  
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

  const navigate = useNavigate();

  // fetching the groups based on the user id
  const fetchGroups = async () => {
    try {
      setLoading(true);
      console.log('Fetching groups for user:', userId);
      const res = await axios.get(
        `http://localhost:4000/api/group/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
      );
      console.log('Groups response:', res.data);
      setGroups(res.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to fetch groups: ${error.response?.status || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // handle for group click
  const handlegroupclick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  // handler for deleting the group
  const handleDelete = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/group/delete/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Group deleted successfully");
      fetchGroups();
    } catch (err) {
      toast.error("Error deleting group");
    }
  };

  // handler for leaving the group
  const handleLeave = async (groupId) => {
    if (!window.confirm("Are you sure you want to leave this group?")) {
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/group/leave/${groupId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Successfully left the group");
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error leaving group");
    }
  };

  // Event editing functions
  const openEditModal = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      dateTime: event.dateTime.slice(0, 16),
      notes: event.notes || "",
      sendReminder: event.reminder?.sendReminder || false,
      reminderTime: event.reminder?.reminderTime
        ? event.reminder.reminderTime.slice(0, 16)
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

    try {
      const updatedEvent = {
        title: editFormData.title.trim(),
        dateTime: new Date(editFormData.dateTime).toISOString(),
        notes: editFormData.notes.trim(),
        reminder: {
          sendReminder: editFormData.sendReminder,
          reminderTime: editFormData.sendReminder
            ? new Date(editFormData.reminderTime).toISOString()
            : null,
        },
      };

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
      
      // Refresh groups to show updated event data
      fetchGroups();
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
          <p className="text-gray-400">Loading your groups...</p>
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
        <div className="absolute top-1/2 left-1/4 text-6xl">🍿</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text">
              Your Groups
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your movie groups and plan amazing movie nights together
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => navigate("/create-group")}
            className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <FaPlus className="w-5 h-5" />
            <span>Create New Group</span>
          </button>
          
          <button
            onClick={() => navigate("/join-group")}
            className="group flex items-center space-x-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
          >
            <span>🎪</span>
            <span>Join Group</span>
          </button>
        </div>

        {/* Groups Grid */}
        {Array.isArray(groups) && groups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group, index) => (
              <div
                key={group._id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                onClick={() => handlegroupclick(group._id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Group Header */}
                <div className="relative p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300">
                          {group.name}
                        </h3>
                        {group.createdBy === userId && (
                          <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-500/30">
                            <FaCrown className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-300 text-xs font-medium">Admin</span>
                          </div>
                        )}
                      </div>
                      
                      {group.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {group.description}
                        </p>
                      )}
                    </div>

                    {/* Delete/Leave Button */}
                    <div className="flex items-center space-x-2">
                      {group.createdBy === userId ? (
                        // Creator can delete the group
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(group._id);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/50 rounded-full text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-110"
                          title="Delete Group"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      ) : (
                        // Members can leave the group
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeave(group._id);
                          }}
                          className="p-2 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/30 hover:border-orange-500/50 rounded-full text-orange-400 hover:text-orange-300 transition-all duration-300 hover:scale-110"
                          title="Leave Group"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Group Info */}
                <div className="p-6">
                  {/* Members Count */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <FaUsers className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-sm">
                      {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Invite Token */}
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Invite Token</p>
                        <p className="font-mono text-gray-300 text-sm">{group.inviteToken}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(group.inviteToken);
                          toast.success("Invite token copied!");
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <span className="text-sm">📋</span>
                      </button>
                    </div>
                  </div>

                  {/* View Group Button */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-gray-400 group-hover:text-white transition-colors duration-300">
                      <FaEye className="w-4 h-4" />
                      <span className="text-sm font-medium">View Group</span>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <FaUsers className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">No Groups Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Create your first group to start planning amazing movie nights with friends and family!
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/create-group")}
                  className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  <FaPlus className="w-5 h-5" />
                  <span>Create Your First Group</span>
                </button>
                
                <button
                  onClick={() => navigate("/join-group")}
                  className="group flex items-center space-x-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
                >
                  <span>🎪</span>
                  <span>Join Existing Group</span>
                </button>
              </div>
            </div>
          </div>
        )}
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

export default Groups;
