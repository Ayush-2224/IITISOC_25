import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Groups = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login"); 
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Groups</h1>
      <div className="flex gap-6">
        <Link
          to="/create-group"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition duration-300"
        >
          Create a Group
        </Link>

        <Link
          to="/join-group"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition duration-300"
        >
          Join a Group
        </Link>
      </div>
    </div>
  );
};

export default Groups;
