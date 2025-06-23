import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import axios from 'axios';
import { FaPoll, FaVoteYea, FaCheck, FaSpinner } from 'react-icons/fa';

function PollCard({ poll, userId, groupId }) {
  const [selectedOption, setSelectedOption] = useState(poll.votes?.[userId] || '');
  const [percentages, setPercentages] = useState(() => {
    const initial = {};
    poll.options.forEach(opt => {
      initial[opt] = parseFloat(poll.percentages?.[opt]) || 0.0;
    });
    return initial;
  });
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

  useEffect(() => {
    const updateHandler = ({ pollId, percentages: updated }) => {
      if (poll._id === pollId) {
        const cleanPercentages = {};
        poll.options.forEach(opt => {
          cleanPercentages[opt] = parseFloat(updated?.[opt]) || 0.0;
        });
        setPercentages(cleanPercentages);
      }
    };

    socket.on("poll-update", updateHandler);
    return () => {
      socket.off("poll-update", updateHandler);
    };
  }, [poll._id]);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-2 border-blue-500/20">
          <FaPoll className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{poll.question}</h3>
          <p className="text-gray-400 text-sm">Tap an option to vote</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {poll.options.map((opt) => {
          const percent = parseFloat(percentages[opt]) || 0.0;
          const isSelected = selectedOption === opt;
          const isWinner = percent === Math.max(...Object.values(percentages));
          
          return (
            <div key={opt} className="relative">
              <button
                onClick={() => handleVote(opt)}
                disabled={isVoting}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/50 shadow-lg' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02]'
                } ${isVoting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {/* Background Progress */}
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-700 ${
                    isWinner && percent > 0 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
                      : 'bg-gray-600/10'
                  }`}
                  style={{ width: `${percent}%` }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">{opt}</span>
                      {isSelected && (
                        <div className="flex items-center space-x-1">
                          <FaCheck className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-xs font-medium">Your vote</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isWinner && percent > 0 && (
                        <span className="text-yellow-400 text-xs">👑</span>
                      )}
                      <span className={`text-sm font-bold ${
                        isSelected ? 'text-blue-300' : 'text-gray-300'
                      }`}>
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : isWinner && percent > 0
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isVoting ? (
              <>
                <FaSpinner className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-blue-400 text-sm font-medium">Submitting vote...</span>
              </>
            ) : selectedOption ? (
              <>
                <FaVoteYea className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  You voted for "{selectedOption}"
                </span>
              </>
            ) : (
              <>
                <FaPoll className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Make your choice!</span>
              </>
            )}
          </div>
          
          <div className="text-gray-400 text-xs">
            {Object.values(percentages).reduce((sum, p) => sum + (p > 0 ? 1 : 0), 0)} votes
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
