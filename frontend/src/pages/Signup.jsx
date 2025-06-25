import React, { useContext, useEffect, useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar.js";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarBox, setAvatarBox] = useState(false);
  const [avatar, setAvatar] = useState(Avatar[0]);
  const { backendUrl, token, login } = useContext(Context)

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:4000/api/user/auth/google`;
  };

  const handleAvatarChange = (idx) => {
    setAvatarIndex(idx);
    setAvatar(Avatar[idx]);
    setAvatarBox(false);
  };

  const handleAvatarBox = () => {
    setAvatarBox(true);
  };
  const handleAvatarBoxClose = () => {
    setAvatarBox(false);
  };

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // handling the signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/register", { 
        name, 
        email, 
        password, 
        profilePic: avatar || Avatar[avatarIndex] 
      });
      
      if (response.data.success) {
        toast.success("User Registered Successfully");
        
        // Automatically log in the user after successful registration
        if (response.data.token) {
          // Get user profile to get complete user data
          const userResponse = await axios.get('http://localhost:4000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          });
          
          login(response.data.token, userResponse.data.user);
          navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-30 text-6xl">🎬</div>
      <div className="absolute top-32 right-16 text-pink-400 opacity-30 text-4xl">🍿</div>
      <div className="absolute bottom-20 left-20 text-blue-400 opacity-30 text-5xl">🎭</div>
      <div className="absolute bottom-32 right-32 text-purple-400 opacity-30 text-4xl">🎪</div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-purple-600 p-3 rounded-full shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2l3.5 2L7 9V5z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent mb-2">
            MovieNight
          </h1>
          <p className="text-gray-400 text-sm">Join your crew for the perfect movie night</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="backdrop-blur-xl bg-black/30 border border-gray-800/50 p-8 rounded-2xl shadow-2xl relative"
        >
          {/* Subtle border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-red-500/20 rounded-2xl blur opacity-60"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Signup
            </h2>

            {/* Avatar Preview and Selector */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={avatar}
                  alt="Selected Avatar"
                  className="relative w-24 h-24 rounded-full border-2 border-gray-700 cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={handleAvatarBox}
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Avatar Selection Box */}
            {avatarBox && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <div className="bg-gray-600/95 border border-gray-700 p-6 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Choose Your Avatar</h3>
                    <button
                      type="button"
                      onClick={handleAvatarBoxClose}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {Avatar.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <div className={`absolute -inset-1 rounded-full blur transition-all duration-300 ${
                          avatarIndex === idx 
                            ? "bg-gradient-to-r from-cyan-400 to-blue-600 opacity-90"

                            : "bg-gray-600 opacity-0 group-hover:opacity-60"
                        }`}></div>
                        <img
                          src={url}
                          alt={`avatar-${idx}`}
                          onClick={() => handleAvatarChange(idx)}
                          className={`relative w-20 h-20 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${
                            avatarIndex === idx ? "border-2 border-purple-500" : "border-2 border-transparent"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <label className="block mb-2 text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 mb-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your name"
            />

            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mb-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            />

            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mb-6 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Create a password"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25 mb-4"
            >
              Signup
            </button>

            <p className="mb-4 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
              >
                Login
              </Link>
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group"
            >
              <img 
                src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" 
                alt="Google logo" 
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-gray-300 font-medium">Continue with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;