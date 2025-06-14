import React, {  useRef } from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket.js';
import axios from 'axios';
import MessageBubble from '../components/MessageBubble.jsx';
import PollCard from '../components/PollCard.jsx';
import SendMessageBar from '../components/SendMessageBar.jsx';

function DiscussionPage() {
    const [feed, setFeed] = useState([]);
    const feedRef = useRef(null);
    const { eventId } = useParams();
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const user = {
  _id: localStorage.getItem("userID"),
};
    const scrollToBottom = () => {
  const el = feedRef.current;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};

    useEffect(() => {
        socket.emit("join-event", { eventId, userId: localStorage.getItem("userID") });

        axios.get(`http://localhost:4000/api/events/combined/${eventId}`).then((res) => {
            setFeed(res.data.feed);
        });

        socket.on("receive-message", (msg) => {
            setFeed((prev) => [{ ...msg, type: "message" }, ...prev]);
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

    }, [eventId]);

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

    return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={feedRef}>
        {feed
          .slice()
          .reverse()
          .map((item) =>
            item.type === "message" ? (
              <MessageBubble key={item._id} message={item} currentUser={user} />
            ) : (
              <PollCard key={item._id} poll={item} userId={user._id} />
            )
          )}
      </div>

      <SendMessageBar eventId={eventId} user={user} />

      {showScrollBtn && (
        <button
          className="fixed bottom-20 right-5 bg-blue-600 text-white p-2 rounded-full shadow"
          onClick={scrollToBottom}
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default DiscussionPage;
