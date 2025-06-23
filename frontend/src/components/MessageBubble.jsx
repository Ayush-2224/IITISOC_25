import React from "react";
import { FaUser, FaClock } from "react-icons/fa";

const MessageBubble = ({ message, currentUser }) => {
  const isOwn = (message.senderId?._id === currentUser._id) || (message.isMine);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
        isOwn 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12" 
          : "bg-white/10 backdrop-blur-sm border border-white/20 text-white mr-12"
      }`}>
        {/* Sender info - only show for others' messages */}
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-white/20">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
              <FaUser className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-200">
              {message.senderId?.name || "Anonymous"}
            </span>
          </div>
        )}

        {/* Message content */}
        <div className={`text-sm leading-relaxed ${isOwn ? "text-white" : "text-gray-100"}`}>
          {message.text}
        </div>

        {/* Image if present */}
        {message.image && (
          <div className="mt-3">
            <img 
              src={message.image} 
              alt="Message attachment" 
              className="max-h-48 w-full object-cover rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-shadow duration-300" 
            />
          </div>
        )}

        {/* Timestamp */}
        <div className={`flex items-center justify-end space-x-1 mt-2 pt-1 ${
          isOwn ? "border-t border-white/20" : "border-t border-white/10"
        }`}>
          <FaClock className={`w-3 h-3 ${isOwn ? "text-white/70" : "text-gray-400"}`} />
          <span className={`text-xs ${isOwn ? "text-white/70" : "text-gray-400"}`}>
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
