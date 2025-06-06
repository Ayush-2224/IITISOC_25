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
  const { backendUrl, token, settoken } = useContext(Context)

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

  // handling the signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/register", { name, email, password, profilePic: avatar || Avatar[avatarIndex] });
      //  console.log(response.data)
      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("User Registered Successfully")
      } else {
        // console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      //console.log(error.response.data);
      toast.error(error.message);
    }
  };

  // if there is token in the local storage navigate to home page
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Signup
        </h2>

        {/* Avatar Preview and Selector */}
        <div className="flex justify-center mb-4">
          <img
            src={avatar}
            alt="Selected Avatar"
            className="w-20 h-20 rounded-full border-4 border-blue-400 cursor-pointer"
            onClick={handleAvatarBox}
          />
        </div>

        {/* Avatar Selection Box */}
        {avatarBox && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg max-w-md w-[90%] max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-center">Choose Your Avatar</h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 justify-items-center">
                {Avatar.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`avatar-${idx}`}
                    onClick={() => handleAvatarChange(idx)}
                    className={`w-24 h-24 rounded-full cursor-pointer border-4 ${avatarIndex === idx ? "border-blue-500" : "border-transparent"
                      } transition duration-200 hover:scale-105`}
                  />
                ))}
              </div>
              <div className="mt-5 text-center">
                <button
                  onClick={handleAvatarBoxClose}
                  className="text-sm text-gray-600 hover:text-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="text-black w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Signup
        </button>
        

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Login
          </Link>
        </p>

         <button
              onClick={handleGoogleLogin}
              className="w-full h-12 flex items-center justify-center gap-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              <img 
                src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" 
                alt="Google logo" 
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>

      </form>
    </div>
  );
};

export default Signup;
