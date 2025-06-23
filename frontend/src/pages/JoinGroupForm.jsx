import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers, FaKey, FaPlus, FaArrowRight } from "react-icons/fa";

const JoinGroupForm = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const Token = localStorage.getItem("token");

  // handler for joining the group
  const handleJoin = async () => {
    if (!token.trim()) {
      toast.error("Please enter an invite token");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/group/join/${token}`, {
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${Token}`,
        }
      });
      toast.success(`🎉 Successfully joined ${res.data.group?.name || 'the group'}!`);
      setToken("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to join the group";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">🚪</div>
        <div className="absolute bottom-20 right-20 text-9xl">👥</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🎬</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl">🍿</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text">
                Join Group
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Enter your invite token to join the movie crew</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-full mb-6 border-2 border-green-500/20">
                <FaKey className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Join?</h2>
              <p className="text-gray-400">
                Paste your invite token below to become part of an amazing movie group!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <FaKey className="w-4 h-4 text-green-400" />
                  <span>Invite Token</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter your invite token here..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaPlus className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Get your token from a group admin or invitation link</span>
                </p>
              </div>

              <button
                onClick={handleJoin}
                disabled={loading || !token.trim()}
                className="w-full group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-green-500/25 disabled:shadow-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Join Group</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-blue-400">ℹ️</span>
                <span>What happens next?</span>
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>You'll instantly become a member of the group</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Access group discussions and movie suggestions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Get notified about upcoming movie nights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Participate in polls and group activities</span>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Don't have an invite token?</p>
              <p className="text-gray-500 text-xs">
                Ask a friend who's already in a group to send you an invitation link,
                or create your own group to start fresh!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupForm;
