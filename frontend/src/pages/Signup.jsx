import React, { useContext, useEffect, useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const {backendUrl,token,settoken}=useContext(Context)

  const navigate = useNavigate()

  // handling the signup
  const handleSignup =async  (e) => {
    e.preventDefault();
    try {
       const response = await axios.post(backendUrl+"/api/user/register",{name,email,password});
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
      // console.log(response.data.message);
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
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Signup
        </h2>

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
      </form>
    </div>
  );
};

export default Signup;
