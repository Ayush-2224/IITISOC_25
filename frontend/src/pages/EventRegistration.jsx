import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendar, FaClock, FaBell, FaPlus, FaArrowLeft, FaSave } from "react-icons/fa";

const EventRegistration = () => {
  const navigate = useNavigate();
  let { groupId } = useParams();
  groupId = (groupId === "__null__") ? null : groupId;
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    notes: "",
    Group: groupId,
    sendReminder: false,
    reminderTime: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Event title is required");
      return false;
    }
    if (!formData.dateTime) {
      setError("Date and time is required");
      return false;
    }
    if (formData.sendReminder && !formData.reminderTime) {
      setError("Reminder time is required when reminder is enabled");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare the data according to the backend model
    const eventData = {
      title: formData.title.trim(),
      dateTime: new Date(formData.dateTime).toISOString(),
      notes: formData.notes.trim(),
      Group: groupId,
      reminder: {
        sendReminder: formData.sendReminder,
        reminderTime: formData.sendReminder
          ? new Date(formData.reminderTime).toISOString()
          : null,
      },
    };
    
    try {
      const response = await axios.post(
        "http://localhost:4000/api/events/create",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Event created successfully! 🎉");
      navigate(`/group/${groupId}`); // Redirect to events list after successful creation
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🎪</div>
        <div className="absolute bottom-20 right-20 text-9xl">📅</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">✨</div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text">
                Create Event
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Plan your next amazing movie night experience</p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Group</span>
          </button>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2"
                >
                  <FaCalendar className="w-4 h-4 text-purple-400" />
                  <span>Event Title</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter a catchy title for your event"
                />
              </div>

              {/* Date and Time */}
              <div>
                <label
                  htmlFor="dateTime"
                  className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2"
                >
                  <FaClock className="w-4 h-4 text-blue-400" />
                  <span>Date and Time</span>
                </label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  required
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  📝 Event Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Add any special instructions, themes, or details about your event..."
                />
              </div>

              {/* Reminder Toggle */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sendReminder"
                    name="sendReminder"
                    checked={formData.sendReminder}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label
                    htmlFor="sendReminder"
                    className="text-gray-300 font-medium flex items-center space-x-2"
                  >
                    <FaBell className="w-4 h-4 text-yellow-400" />
                    <span>Send reminder notification</span>
                  </label>
                </div>
                
                {formData.sendReminder && (
                  <div className="mt-6">
                    <label
                      htmlFor="reminderTime"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Reminder Time
                    </label>
                    <input
                      type="datetime-local"
                      id="reminderTime"
                      name="reminderTime"
                      value={formData.reminderTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      We'll notify all participants at this time
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-blue-400">💡</span>
                <span>Tips for a great event</span>
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Choose a time when most group members are available</li>
                <li>• Add movie suggestions to help participants prepare</li>
                <li>• Set a reminder 1-2 hours before the event</li>
                <li>• Include any special requirements (snacks, streaming service, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
