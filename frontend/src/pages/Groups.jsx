import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaUsers, FaCrown, FaPlus, FaEye } from "react-icons/fa";

const Groups = () => {
  const userId = localStorage.getItem("userId");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
      const token = localStorage.getItem("token");
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

                    {/* Delete Button */}
                    {group.createdBy === userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(group._id);
                        }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/50 rounded-full text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-110"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
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
    </div>
  );
};

export default Groups;
