import PollDialog from "./PollDialog";
import React, { useRef } from 'react'
import axios from "axios";
import { useState } from "react";
import {socket} from "../socket";
import { FaPaperPlane, FaCamera, FaPoll, FaTimes, FaSpinner } from "react-icons/fa";

function SendMessageBar({ groupId, user, onMessageSent }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const resetInput = () => {
    setText("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !imageFile) return; 
    setIsSending(true);

    try {
      let formData = new FormData();
      formData.append("text", text);
      if (imageFile) formData.append("profilePic", imageFile);
      formData.append("userId", user._id);

      const res = await axios.post(`http://localhost:4000/api/message/send/${groupId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Add the message to the feed immediately for the sender
      if (onMessageSent && res.data.data) {
        const messageWithType = { 
          ...res.data.data, 
          type: "message", 
          isMine: true 
        };
        onMessageSent(messageWithType);
      }

      // Emit socket event for other users
      socket.emit("send-message", {
        groupId,
        message: {
          ...res.data.data, // Use the message from the API response
          senderId: user._id,
          senderName: user.name || "Anonymous User",
          senderAvatar: user.profilePic || "https://api.dicebear.com/9.x/micah/svg?seed=Anonymous",
          sender: {
            _id: user._id,
            name: user.name || "Anonymous User",
            profilePic: user.profilePic || "https://api.dicebear.com/9.x/micah/svg?seed=Anonymous",
          }
        }
      });

      resetInput();
    } catch (error) {
      console.error("Send message failed:", error);
      alert("Failed to send message");
    }

    setIsSending(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <>
      {/* Image preview */}
      {imagePreview && (
        <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-24 rounded-xl object-contain border border-white/20 shadow-md"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">Image Ready</h4>
              <p className="text-gray-400 text-xs">This image will be sent with your message</p>
            </div>
            <button
              onClick={removeImage}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
              type="button"
              aria-label="Remove image"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center space-x-3">
          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              disabled={isSending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              maxLength={500}
            />
            {text.length > 400 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className={`text-xs ${text.length > 480 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {text.length}/500
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
              disabled={isSending}
            />
            
            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300 group"
              type="button"
              title="Upload image"
            >
              <FaCamera className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Poll button */}
            <button
              onClick={() => setShowPollDialog(true)}
              disabled={isSending}
              className="p-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all duration-300 group"
              type="button"
              title="Create poll"
            >
              <FaPoll className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={isSending || (!text.trim() && !imageFile)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none"
              type="button"
            >
              {isSending ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaPaperPlane className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Character count warning */}
        {text.length > 400 && (
          <div className="mt-2 text-center">
            <p className={`text-xs ${text.length > 480 ? 'text-red-400' : 'text-yellow-400'}`}>
              {text.length > 480 ? 'Message is getting too long!' : 'Message is getting long'}
            </p>
          </div>
        )}
      </div>

      {showPollDialog && (
        <PollDialog
          groupId={groupId}
          userId={user._id}
          onClose={() => setShowPollDialog(false)}
        />
      )}
    </>
  );
}

export default SendMessageBar;
