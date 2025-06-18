import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateGroupForm = () => {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [desc, setdesc] = useState("");
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  
  // fetching the groups based on the user id
  const fetchGroups = async () => {
    const res = await axios.get(
      `http://localhost:4000/api/group/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // handle for group click
  const handlegroupclick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

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
      //   console.log(res.data)
      toast.success("Group created Successfully , use the invitetoken");
      //   alert("Group Created! Share this token: " + res.data.inviteToken);
      fetchGroups();
      setName("");
      setdesc("");
    } catch (err) {
      //   console.error(err);
      toast.error("Error creating group");
    }
  };

  // handler for deleting the group
  const handleDelete = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/group/delete/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchGroups();
    } catch (err) {
      // console.error("Failed to delete group:", err);
      toast.error("Error deleting group");
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2 text-white">Your Groups</h3>
        {Array.isArray(groups) &&
          groups.map((group) => (
            <div
              key={group._id}
              className="p-4 bg-gray-800 rounded mb-2 cursor-pointer text-white flex justify-between items-center"
              onClick={() => handlegroupclick(group._id)}
            >
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {group.name}
                  {group.createdBy === userId && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-sm">Invite Token: {group.inviteToken}</div>
              </div>

              {group.createdBy === userId && (
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(group._id);
                  }}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreateGroupForm;
