import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket.js';
import axios from 'axios';
import MessageBubble from '../components/MessageBubble.jsx';
import PollCard from '../components/PollCard.jsx';
import SendMessageBar from '../components/SendMessageBar.jsx';
import { FaArrowDown, FaComments, FaPoll } from 'react-icons/fa';

function DiscussionPage() {
  const [feed, setFeed] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(null);
  const { groupId } = useParams();
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const user = {
    _id: localStorage.getItem("userId"),
  };

  const scrollToBottom = () => {
    const el = feedRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/api/group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupInfo(response.data);
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };

    fetchGroupInfo();
    socket.emit("join-event", { groupId, userId: user._id });
    
    axios.get(`http://localhost:4000/api/message/combined/${groupId}`).then((res) => {
      setFeed(res.data.feed);
      setLoading(false);
    });

    socket.on("receive-message", (msg) => {
      const isMine = msg.senderId === user._id;
      setFeed((prev) => [{ ...msg, type: "message", isMine }, ...prev]);
    });

    socket.on("send-poll", (poll) => {
      setFeed((prev) => [{ ...poll, type: "poll" }, ...prev]);
    });

    socket.on("poll-update", ({ pollId, percentages }) => {
      setFeed((prev) =>
        prev.map((item) =>
          item._id === pollId && item.type === "poll"
            ? { ...item, percentages }
            : item
        )
      );
    });

    return () => {
      socket.off("receive-message");
      socket.off("send-poll");
      socket.off("poll-update");
    };
  }, [groupId]);

  useEffect(() => {
    const handleScroll = () => {
      const el = feedRef.current;
      if (el.scrollTop < el.scrollHeight - el.clientHeight - 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    const container = feedRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading discussion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-9xl">💬</div>
        <div className="absolute bottom-20 right-20 text-9xl">👥</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🗨️</div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="backdrop-blur-xl bg-black/20 border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaComments className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {groupInfo?.name || 'Group Discussion'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {groupInfo?.members?.length || 0} members • Live chat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto px-4">
            <div 
              className="h-full overflow-y-auto py-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
              ref={feedRef}
            >
              {feed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <FaComments className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">No messages yet</h3>
                  <p className="text-gray-500 max-w-md">
                    Start the conversation! Share your thoughts, create polls, or suggest movies for your group.
                  </p>
                </div>
              ) : (
                feed
                  .slice()
                  .reverse()
                  .map((item) =>
                    item.type === "message" ? (
                      <div key={item._id} className="animate-fade-in">
                        <MessageBubble message={item} currentUser={user} />
                      </div>
                    ) : (
                      <div key={item._id} className="flex justify-end animate-fade-in">
                        <div className="max-w-md">
                          <PollCard poll={item} userId={user._id} />
                        </div>
                      </div>
                    )
                  )
              )}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="backdrop-blur-xl bg-black/20 border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <SendMessageBar groupId={groupId} user={user} />
          </div>
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollBtn && (
          <button
            className="fixed bottom-24 right-8 group bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 z-30"
            onClick={scrollToBottom}
          >
            <FaArrowDown className="w-5 h-5 group-hover:animate-bounce" />
          </button>
        )}

        {/* Stats Footer */}
        <div className="backdrop-blur-xl bg-black/10 border-t border-white/5 p-2 relative z-10">
          <div className="max-w-4xl mx-auto flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <FaComments className="w-4 h-4 text-blue-400" />
              <span>{feed.filter(item => item.type === "message").length} messages</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaPoll className="w-4 h-4 text-green-400" />
              <span>{feed.filter(item => item.type === "poll").length} polls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;
