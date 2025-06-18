import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const JoinGroupForm = () => {
  const [token, setToken] = useState("");
  const userId = localStorage.getItem("userId");
  const Token = localStorage.getItem("token");

  
  // handler for joining the group
  const handleJoin = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/api/group/join/${token}`, {
        userId,
      },{
    headers: {
      Authorization: `Bearer ${Token}`,
    }});
     toast.success("Successfully joined the group")
      // alert("Successfully joined group: " + res.data.group.name);
    } catch (err) {
      toast.error("Failed to join the group")
      // alert("Failed to join group");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-black shadow rounded text-white">
      <h2 className="text-xl font-bold mb-4">Join a Group</h2>
      <input
        type="text"
        className="border px-4 py-2 rounded w-full mb-4"
        placeholder="Paste invite token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={handleJoin}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
      >
        Join Group
      </button>
    </div>
  );
};

export default JoinGroupForm;
