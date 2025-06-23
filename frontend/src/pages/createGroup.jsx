import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers, FaPlus, FaStar, FaFilm, FaPaperPlane } from "react-icons/fa";

const CreateGroupForm = () => {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // handler for creating the group
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    if (!desc.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/group/create",
        {
          name: name.trim(),
          createdBy: userId,
          description: desc.trim(),
          members: [userId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🎉 Group created successfully! Share the invite token with friends.");
      setName("");
      setDesc("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating group";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">⭐</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🎪</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl">🍿</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
                Create Group
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Start your own movie night community</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full mb-6 border-2 border-blue-500/20">
                <FaUsers className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Build Your Movie Crew</h2>
              <p className="text-gray-400">
                Create a group where friends can discover, discuss, and enjoy movies together
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span>Group Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter a creative name for your group"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                />
                <p className="text-gray-500 text-sm mt-2 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Make it fun and memorable!</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <FaFilm className="w-4 h-4 text-purple-400" />
                  <span>Description</span>
                </label>
                <textarea
                  placeholder="Describe what your group is about, favorite genres, or any special themes..."
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows="4"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm flex items-center space-x-1">
                    <span>📝</span>
                    <span>Tell people what makes your group special</span>
                  </p>
                  <span className="text-gray-500 text-xs">
                    {desc.length}/200
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !desc.trim()}
                  className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Create Group</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Features Preview */}
            <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-green-400">🎯</span>
                <span>Your group will have</span>
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Real-time group chat for movie discussions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Collaborative movie suggestions and voting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Event planning for movie nights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Shared watchlists and recommendations</span>
                </li>
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
              <h3 className="text-yellow-300 font-semibold mb-3 flex items-center space-x-2">
                <span>💡</span>
                <span>Pro Tips</span>
              </h3>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Use emojis in your group name to make it stand out</li>
                <li>• Mention your favorite genres in the description</li>
                <li>• Include your time zone if planning regular events</li>
                <li>• Share the invite token to grow your community!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupForm;
