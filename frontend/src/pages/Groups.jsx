import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const Groups = () => {
  const userId = localStorage.getItem("userId");
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
  );
};

export default Groups;
