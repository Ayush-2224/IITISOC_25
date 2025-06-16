import React from 'react'
import { socket } from '../socket';
import axios from 'axios';
import { useEffect,useState } from 'react';
function PollCard({ poll, userId, eventId }) {
      const [selectedOption, setSelectedOption] = useState(poll.votes?.[userId] || '');
  const [percentages, setPercentages] = useState(poll.percentages || {});
  const [isVoting, setIsVoting] = useState(false);

   const handleVote = async (option) => {
    if (!option || isVoting) return;
    setIsVoting(true);
    try {
      await axios.post(`http://localhost:4000/api/poll/vote/${poll._id}`, { userId, option });
      setSelectedOption(option);
    } catch (err) {
      console.error('Vote failed', err);
    }
    setIsVoting(false);
  };

  useEffect(()=>{
    const updateHandler=({ pollId, percentages:updated }) => {
      if (poll._id === pollId) {
        setPercentages(updated);
      }
    }
    socket.on("poll-update", updateHandler);
    return () => {
      socket.off("poll-update", updateHandler);
    }
  },[socket, poll._id]);


  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-3">{poll.question}</h3>
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const percent = parseFloat(percentages[opt]) || 0;
          const isSelected = selectedOption === opt;
          return (
            <div key={opt}>
              <button
                onClick={() => handleVote(opt)}
                disabled={isVoting}
                className={`w-full text-left p-2 border rounded-md ${
                  isSelected ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  <span className="text-sm text-gray-600">{percent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>
      {selectedOption && (
        <p className="text-sm text-green-600 mt-2">You voted: {selectedOption}</p>
      )}
    </div>
  );
};


export default PollCard;
