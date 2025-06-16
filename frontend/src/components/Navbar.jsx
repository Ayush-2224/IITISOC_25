import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token, settoken } = useContext(Context);
  const navigate = useNavigate();

  const handlelogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    settoken("");
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

      <Link to="/groups">
        {" "}
        <div className="text-xl font-bold text-blue-600">
          Groups
        </div>{" "}
      </Link>



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
