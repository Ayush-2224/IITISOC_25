import React, { useState } from 'react';
import {toast} from 'react-hot-toast'
import axios from 'axios';
import { Context } from '../context/Context';
import { useContext } from 'react';
function ForgotPassword() {
  const [email, setEmail] = useState('');
   const { backendUrl } = useContext(Context)
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }
    console.log(backendUrl);
    try {
      const res=await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      console.log(res)
      setEmail('');
      toast.success("Email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Check Email and Try again");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-orange-400">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-amber-300"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Send Reset Email
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
