import PollDialog from "./PollDialog";
import React, { useRef } from 'react'
import axios from "axios";
import { useState } from "react";
import {socket} from "../socket";
function SendMessageBar({ eventId, user }) {
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

    const res = await axios.post(`http://localhost:4000/api/message/send/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    socket.emit("send-message", {
  eventId,
  message: {
    text,
    sender: {
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
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


 return (
    <>
      <div className="p-4 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow p-2 border rounded"
          disabled={isSending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isSending}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload image"
          className="btn-secondary px-3 py-2 rounded"
          disabled={isSending}
          type="button"
        >
          📷
        </button>
        <button
          onClick={handleSendMessage}
          className="btn-primary px-4 py-2 rounded"
          disabled={isSending || (!text.trim() && !imageFile)}
          type="button"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => setShowPollDialog(true)}
          title="Create Poll"
          className="btn-secondary px-3 py-2 rounded"
          type="button"
          disabled={isSending}
        >
          🗳️
        </button>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="p-4 border-t bg-gray-50 flex items-center space-x-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-24 rounded-md object-contain"
          />
          <button
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = null;
            }}
            className="text-red-600 font-bold text-xl select-none"
            type="button"
            aria-label="Remove image preview"
          >
            &times;
          </button>
        </div>
      )}

      {showPollDialog && (
        <PollDialog
          eventId={eventId}
          userId={user._id}
          onClose={() => setShowPollDialog(false)}
        />
      )}
    </>
  );
}

export default SendMessageBar
