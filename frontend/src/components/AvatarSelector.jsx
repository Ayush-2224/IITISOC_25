import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const AvatarSelector = ({ selectedAvatar, onAvatarSelect, isOpen, onClose }) => {
  // Predefined avatar styles and seeds from DiceBear
  const avatarStyles = [
    'notionists',
    'avataaars',
    'fun-emoji',
    'thumbs',
    'adventurer',
    'big-smile',
    'bottts',
    'croodles',
    'icons',
    'identicon'
  ];

  const avatarSeeds = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
    'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
    'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Eagle', 'Wolf', 'Bear', 'Fox'
  ];

  // Generate avatar combinations
  const generateAvatars = () => {
    const avatars = [];
    avatarStyles.forEach(style => {
      avatarSeeds.slice(0, 4).forEach(seed => { // 4 seeds per style for variety
        avatars.push(`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`);
      });
    });
    return avatars;
  };

  const predefinedAvatars = generateAvatars();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Choose Your Avatar</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2">Select an avatar that represents you</p>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
            {predefinedAvatars.map((avatarUrl, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  selectedAvatar === avatarUrl
                    ? 'ring-4 ring-blue-500 shadow-lg transform scale-105'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                onClick={() => onAvatarSelect(avatarUrl)}
              >
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {selectedAvatar === avatarUrl && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <FaCheck className="text-blue-600 text-xl bg-white rounded-full p-1 w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector; 