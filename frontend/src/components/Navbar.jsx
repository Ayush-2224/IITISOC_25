import React, { useContext, useState } from "react";
import { FaUserCircle, FaFilm, FaUsers, FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const { token, logout } = useContext(Context);
  const navigate = useNavigate();

  const handlelogout = () => {
    navigate("/");
    logout();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
                <FaFilm className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                MovieNight
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Plan • Watch • Enjoy</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <span className="text-xl">🔥</span>
              <span className="font-medium">Explore</span>
            </Link>
            
            <Link
              to="/watchlist"
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 px-4 py-2 rounded-full text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
            >
              <FaBookmark className="w-4 h-4" />
              <span className="font-medium">Watchlist</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Groups Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen1(!dropdownOpen1)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 px-4 py-2 rounded-full text-indigo-300 hover:text-indigo-200 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105"
              >
                <FaUsers className="w-4 h-4" />
                <span className="font-medium">Groups</span>
                <span className="text-xs">⏷</span>
              </button>

              {dropdownOpen1 && (
                <div className="absolute right-0 mt-3 w-56 backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    <Link
                      to="/groups"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setDropdownOpen1(false)}
                    >
                      <span className="text-lg">👥</span>
                      <span>All Groups</span>
                    </Link>
                    <Link
                      to="/create-group"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setDropdownOpen1(false)}
                    >
                      <span className="text-lg">✨</span>
                      <span>Create Group</span>
                    </Link>
                    <Link
                      to="/join-group"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setDropdownOpen1(false)}
                    >
                      <span className="text-lg">🎪</span>
                      <span>Join Group</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-full">
                  <FaUserCircle className="w-6 h-6 text-white" />
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    {!token ? (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-lg">🚀</span>
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/signup"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-lg">✨</span>
                          <span>Signup</span>
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={handlelogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
                      >
                        <span className="text-lg">👋</span>
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex justify-center space-x-6">
          <Link
            to="/explore"
            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-all duration-300"
          >
            <span>🔥</span>
            <span className="text-sm">Explore</span>
          </Link>
          <Link
            to="/watchlist"
            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-all duration-300"
          >
            <FaBookmark className="w-3 h-3" />
            <span className="text-sm">Watchlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
