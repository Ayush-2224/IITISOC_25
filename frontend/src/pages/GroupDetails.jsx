import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UpcomingEvents from "../components/UpcomingEvents.jsx";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setGroup(res.data);
        setLoading(false);
      } catch (err) {
        // console.error("Error fetching group:", err);
        setError("Failed to load group details.");
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/events/getGroup/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching group events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
    fetchEvents();
  }, [groupId]);

  const joinEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/events/join/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e._id === eventId ? { ...e, isParticipant: true } : e
        )
      );
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error("Failed to join event");
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/events/leave/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e._id === eventId ? { ...e, isParticipant: false } : e
        )
      );
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error leaving event:", err);
      toast.error("Failed to leave event");
    }
  };


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

      <UpcomingEvents
        events={events}
        userId={localStorage.getItem("userId")}
        groupCreatorId={group?.createdBy?._id}
        onDelete={(deletedId) =>
          setEvents((prev) => prev.filter((e) => e._id !== deletedId))
        }
        joinEvent={joinEvent}
        leaveEvent={leaveEvent}
      />
      <div className="flex gap-10">
        <Link
          to={`/discussion/${groupId}`}
          className="inline-block mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition duration-200"
        >
          💬 Chat with your friends
        </Link>
        <Link
          to={`/events/create/${groupId}`}
          className="inline-block mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition duration-200"
        >
          Create an Event
        </Link>
      </div>
    </div>
  );
};

export default GroupDetails;
