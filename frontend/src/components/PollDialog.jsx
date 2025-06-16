import axios from "axios";  
import React from 'react'
import {socket} from "../socket";
import { useState } from "react";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Create Poll</h2>
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          disabled={isSubmitting}
        />
        {options.map((opt, idx) => (
          <div key={idx} className="flex mb-2 items-center">
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-grow border p-2 rounded"
              disabled={isSubmitting}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(idx)}
                className="ml-2 text-red-600 font-bold text-xl select-none"
                disabled={isSubmitting}
                aria-label="Remove option"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          className="text-blue-600 mb-4 disabled:text-gray-400"
          disabled={isSubmitting}
          type="button"
        >
          + Add Option
        </button>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PollDialog;
