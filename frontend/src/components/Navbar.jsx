import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const { token, settoken } = useContext(Context);
  const navigate = useNavigate();

  const handlelogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    settoken("");
    localStorage.removeItem("userId");
    toast.success("You have logged out successfully");
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        {" "}
        <div className="text-xl font-bold text-blue-600">
          Movie Night Planner
        </div>{" "}
      </Link>

      <Link
        to="/watchlist"
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded shadow transition duration-200"
      >
        🎞️ Watchlist
      </Link>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen1(!dropdownOpen1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg focus:outline-none"
        >
          Groups ⏷
        </button>

        {dropdownOpen1 && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
            <Link
              to="/groups"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen1(false)}
            >
              All Groups
            </Link>
            <Link
              to="/create-group"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen1(false)}
            >
              Create Group
            </Link>
            <Link
              to="/join-group"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen1(false)}
            >
              Join Group
            </Link>
          </div>
        )}
      </div>

      {/* Account Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          <FaUserCircle size={28} />
        </button>
        <>
          {!token && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
              <a
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Login
              </a>
              <a
                href="/signup"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Signup
              </a>
            </div>
          )}
        </>
        <>
          {token && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
              <p
                onClick={handlelogout}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </p>
            </div>
          )}
        </>
      </div>
    </nav>
  );
};

export default Navbar;
