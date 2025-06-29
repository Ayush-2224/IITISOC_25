import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../context/Context';
import { toast } from 'react-toastify';
import { FaCamera, FaUser, FaEdit, FaSave, FaTimes, FaBookmark, FaUsers } from 'react-icons/fa';
import { MdMovieFilter } from 'react-icons/md';
import axios from 'axios';
import AvatarSelector from '../components/AvatarSelector';
import { Link } from 'react-router-dom';
const UserProfile = () => {
  const { backendUrl, token, user, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  // Form states - removed email
  const [formData, setFormData] = useState({
    name: '',
    profilePic: ''
  });

  // Get user profile on component mount
  useEffect(() => {
    if (!token) {
      toast.error('Please login to access your profile');
      setLoading(false);
      return;
    }
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    if (!token) {
      toast.error('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile with token:', token?.substring(0, 10) + '...');
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          profilePic: response.data.user.profilePic
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({
      ...prev,
      profilePic: avatarUrl
    }));
    toast.success('Avatar selected successfully! 🎨');
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const response = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setEditing(false);
        toast.success('Profile updated successfully! 🎉');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        profilePic: user.profilePic
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-8">Please login to access your profile.</p>
          <a href="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">👤</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">⭐</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl">🍿</div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              My Profile
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Manage your account settings and profile information</p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
          {/* Cover Photo */}
          <div className="h-56 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-24 mb-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 group-hover:shadow-3xl transition-all duration-300">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-gray-400 text-5xl" />
                    </div>
                  )}
                </div>
                
                {editing && (
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 transform"
                  >
                    <FaCamera className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* User Name Display */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {user?.name || 'User Name'}
              </h2>
              <p className="text-gray-400 text-lg">{user?.email}</p>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center mb-8">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <FaEdit className="text-lg" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaSave className="text-lg" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaTimes className="text-lg" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information */}
            {editing && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8 shadow-inner">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Edit Information</h3>
                <div className="max-w-md mx-auto">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-gray-300 font-semibold text-lg">
                      <FaUser className="text-blue-400 text-xl" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 text-lg hover:border-purple-400 text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Stats Cards - Only Watchlist and Groups */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link to="/watchlist">  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <MdMovieFilter className="text-4xl mx-auto mb-3 text-blue-400" />
                <h3 className="font-bold text-lg text-white">Watchlist</h3>
                <p className="text-blue-300 text-sm">Your movie collection</p>
              </div>
              </Link>
              
              
              <Link to="/groups"> <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaUsers className="text-4xl mx-auto mb-3 text-purple-400" />
                <h3 className="font-bold text-lg text-white">Groups</h3>
                <p className="text-purple-300 text-sm">Movie communities</p>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        selectedAvatar={formData.profilePic}
        onAvatarSelect={handleAvatarSelect}
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
      />
    </div>
  );
};

export default UserProfile; 