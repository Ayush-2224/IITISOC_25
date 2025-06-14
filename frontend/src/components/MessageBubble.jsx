import React from "react";

const MessageBubble = ({ message, currentUser }) => {
  const isOwn = message.senderId?._id === currentUser._id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xs p-3 rounded-lg shadow bg-white dark:bg-gray-800">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {isOwn ? "You" : message.senderId?.name || "Anonymous"}
        </div>
        <div className="text-base text-gray-800 dark:text-white">
          {message.text}
        </div>
        {message.image && (
          <img src={message.image} alt="msg-img" className="mt-2 rounded-md max-h-48" />
        )}
        <div className="text-xs text-gray-400 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
