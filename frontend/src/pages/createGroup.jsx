import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

const CreateGroupForm = () => {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [desc, setdesc] = useState("");

  const token = localStorage.getItem("token");


  // handler for creating the group
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/group/create",
        {
          name,
          createdBy: userId,
          description: desc,
          members: [userId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Group created Successfully , use the invitetoken");
      fetchGroups();
      setName("");
      setdesc("");
    } catch (err) {
      //   console.error(err);
      toast.error("Error creating group");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-black shadow rounded text-white">
      <h2 className="text-xl font-bold mb-4">Create a Group</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Group Name"
          className="border px-4 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border px-4 py-2 rounded"
          value={desc}
          onChange={(e) => setdesc(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
