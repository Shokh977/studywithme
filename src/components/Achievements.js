import React, { useState } from 'react';

const Achievements = () => {
  const [badges, setBadges] = useState([
    { id: 1, name: 'Night Owl', description: 'Studied late at night', earned: true },
    { id: 2, name: 'Focused Master', description: 'Completed 5 study sessions in a row', earned: false },
    { id: 3, name: 'Early Bird', description: 'Studied early in the morning', earned: false },
  ]);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl mb-6">
      <h2 className="text-2xl font-bold mb-4">Achievements & Badges</h2>
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 border rounded-lg ${badge.earned ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-bold text-gray-800">{badge.name}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
            {badge.earned && <span className="text-green-600 font-medium">Earned</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;