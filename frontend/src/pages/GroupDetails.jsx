import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UpcomingEvents from "../components/UpcomingEvents.jsx";
import { FaUsers, FaCopy, FaComments, FaPlus, FaUserCheck, FaUserTimes, FaCrown, FaCalendarAlt } from "react-icons/fa";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
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

  const copyInviteToken = () => {
    navigator.clipboard.writeText(group.inviteToken);
    setCopied(true);
    toast.success("Invite token copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error loading group</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">👥</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎬</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">⭐</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              {group.name}
            </h1>
          </div>
          {group.description && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {group.description}
            </p>
          )}
        </div>

        {/* Invite Token Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-green-400">🔗</span>
            <span>Invite Friends</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">Invite Token:</p>
              <code className="text-purple-300 font-mono text-lg">{group.inviteToken}</code>
            </div>
            <button
              onClick={copyInviteToken}
              className={`group px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 ${
                copied 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <FaCopy className="w-4 h-4 text-white" />
              <span className="text-white font-medium">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <FaUsers className="w-6 h-6 text-indigo-400" />
            <span>Members ({group.members?.length || 0})</span>
          </h3>
          
          {group.members?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.profilePic || "https://via.placeholder.com/40x40?text=👤&bg=1a1a1a&color=666666"}
                      alt={member.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40x40?text=👤&bg=1a1a1a&color=666666";
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium flex items-center space-x-2">
                        <span>{member.name || member.email || "Anonymous"}</span>
                        {member._id === group?.createdBy?._id && (
                          <FaCrown className="w-3 h-3 text-yellow-400" title="Group Creator" />
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="w-12 h-12 text-gray-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-300 mb-2">No members yet</h4>
              <p className="text-gray-500">Share the invite token to grow your group!</p>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="mb-8">
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
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to={`/discussion/${groupId}`}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-3"
          >
            <FaComments className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Join Discussion</span>
          </Link>
          
          <Link
            to={`/events/create/${groupId}`}
            className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-3"
          >
            <FaCalendarAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Group Stats */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <span className="text-blue-400">📊</span>
            <span>Group Statistics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {group.members?.length || 0}
              </div>
              <p className="text-gray-400 text-sm">Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {events.length}
              </div>
              <p className="text-gray-400 text-sm">Events</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {events.filter(e => new Date(e.dateTime) > new Date()).length}
              </div>
              <p className="text-gray-400 text-sm">Upcoming</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {Math.round(Math.random() * 30) + 85}%
              </div>
              <p className="text-gray-400 text-sm">Activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
