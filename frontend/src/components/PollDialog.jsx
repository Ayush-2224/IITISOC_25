import axios from "axios";  
import React from 'react'
import {socket} from "../socket";
import { useState } from "react";
import { FaPoll, FaPlus, FaTimes, FaSpinner, FaSave, FaTrash } from "react-icons/fa";

function PollDialog({ groupId, userId, onClose }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addOption = () => setOptions((opts) => [...opts, ""]);
    const removeOption = (index) => setOptions((opts) => opts.filter((_, i) => i !== index));
    const handleOptionChange = (idx, value) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!question.trim() || options.some((opt) => !opt.trim()) || options.length < 2) {
    alert("Please enter question and at least 2 options.");
    return;
  }

  setIsSubmitting(true);
  try {
    const pollData = { question, options, groupId, userId };
    const res = await axios.post(`http://localhost:4000/api/poll/create`, pollData);

    // ✅ Emit to socket
    socket.emit("send-poll", res.data.poll);

    onClose(); // Close modal
  } catch (err) {
    console.error("Create poll error", err);
    alert("Failed to create poll");
  }
  setIsSubmitting(false);
};

   
 return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-2 border-blue-500/20">
              <FaPoll className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Poll</h2>
              <p className="text-gray-400 text-sm">Ask your group to vote</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            type="button"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poll Question
            </label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              disabled={isSubmitting}
              maxLength={200}
            />
            <p className="text-gray-500 text-xs mt-2">{question.length}/200 characters</p>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poll Options
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 text-xs">{idx + 1}</span>
                    </div>
                  </div>
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(idx)}
                      disabled={isSubmitting}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                      type="button"
                      aria-label="Remove option"
                    >
                      <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            {options.length < 6 && (
              <button
                onClick={addOption}
                disabled={isSubmitting}
                className="mt-4 w-full p-3 bg-white/5 border border-white/20 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2 group"
                type="button"
              >
                <FaPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Add Option ({options.length}/6)</span>
              </button>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-medium"
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim() || options.some(opt => !opt.trim()) || options.length < 2}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  <span>Create Poll</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
            <span className="text-yellow-400">💡</span>
            <span>Poll Tips</span>
          </h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Keep questions clear and specific</li>
            <li>• Add 2-6 distinct options</li>
            <li>• Polls help groups make decisions together</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PollDialog;
