import React from 'react';
import { Link } from 'react-router-dom';


const Groups = () => {
    

  return (
    <>
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
    </>
  );
};

export default Groups;
