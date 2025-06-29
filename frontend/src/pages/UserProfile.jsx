import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../context/Context';
import { toast } from 'react-toastify';
import { FaCamera, FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaUpload, FaHeart, FaCalendar, FaUsers } from 'react-icons/fa';
import { MdMovieFilter } from 'react-icons/md';
import axios from 'axios';
import AvatarSelector from '../components/AvatarSelector';

const UserProfile = () => {
  const { backendUrl, token, user, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
          email: response.data.user.email,
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

    if (!formData.email.trim()) {
      toast.error('Email is required');
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
        email: user.email,
        profilePic: user.profilePic
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-8">Please login to access your profile.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 text-gray-900">
      <div className="max-w-5xl mx-auto text-gray-900">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account settings and profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 text-gray-900">
          {/* Cover Photo */}
          <div className="h-56 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 group-hover:shadow-3xl transition-all duration-300">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {user?.name || 'User Name'}
              </h2>
              <p className="text-gray-600 text-lg">{user?.email}</p>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center mb-8">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <FaEdit className="text-lg" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaSave className="text-lg" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaTimes className="text-lg" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information */}
            {editing && (
              <div className="bg-gray-50 rounded-2xl p-8 mb-8 shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Information</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-gray-700 font-semibold text-lg">
                      <FaUser className="text-blue-600 text-xl" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-lg hover:border-blue-400 text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-gray-700 font-semibold text-lg">
                      <FaEnvelope className="text-blue-600 text-xl" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-lg hover:border-blue-400 text-gray-900"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <MdMovieFilter className="text-4xl mx-auto mb-3" />
                <h3 className="font-bold text-lg">Watchlist</h3>
                <p className="text-blue-100 text-sm">Your movie collection</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaUsers className="text-4xl mx-auto mb-3" />
                <h3 className="font-bold text-lg">Groups</h3>
                <p className="text-purple-100 text-sm">Movie communities</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaCalendar className="text-4xl mx-auto mb-3" />
                <h3 className="font-bold text-lg">Events</h3>
                <p className="text-green-100 text-sm">Movie nights planned</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaHeart className="text-4xl mx-auto mb-3" />
                <h3 className="font-bold text-lg">Favorites</h3>
                <p className="text-pink-100 text-sm">Loved movies</p>
              </div>
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