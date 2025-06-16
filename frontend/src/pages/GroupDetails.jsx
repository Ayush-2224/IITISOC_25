import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

 

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/group/${groupId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    }});
        setGroup(res.data);
        setLoading(false);
      } catch (err) {
        // console.error("Error fetching group:", err);
        setError("Failed to load group details.");
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);
  

  if (loading) {
    return <div className="text-center text-white mt-8">Loading group...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      {group.description && (
        <p className="text-gray-300 mb-4">{group.description}</p>
      )}
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          Invite Token: <span className="font-mono">{group.inviteToken}</span>
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Members</h3>
      <ul className="list-disc ml-6 space-y-1">
        {group.members?.length > 0 ? (
          group.members.map((member) => (
            <li key={member._id}>
              {member.name || member.email || member._id}
            </li>
          ))
        ) : (
          <p className="text-gray-400">No members yet.</p>
        )}
      </ul>
      <Link
  to={`/discussion/${groupId}`}
  className="inline-block mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition duration-200"
>
  💬 Chat with your friends
</Link>

    </div>
  );
};

export default GroupDetails;
