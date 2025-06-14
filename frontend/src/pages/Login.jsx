import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const {backendUrl,token,settoken}=useContext(Context)
   const navigate=useNavigate()
   const handleGoogleLogin = () => {
    window.location.href = `http://localhost:4000/api/user/auth/google`;
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        // console.log(response)
        if (response.data.success) {
          settoken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("You have logged in succesfully")
        } else {
          // console.log(response.data.message);
          toast.error(response.data.message);
        }
    } catch (error) {
        // console.log(response.data.message);
         toast.error(error.message);
    } 
    }
  


   useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  

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
          <p className="text-gray-400 text-sm">Welcome back to your movie crew</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="backdrop-blur-xl bg-black/30 border border-gray-800/50 p-8 rounded-2xl shadow-2xl relative"
        >
          {/* Subtle border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-red-500/20 rounded-2xl blur opacity-60"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Login
            </h2>

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
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25 mb-4"
            >
              Login
            </button>
            
            <p className="mb-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
              >
                Signup
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

export default Login;