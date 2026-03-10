import React, { useState } from 'react';

const Growth = () => {
  const [growthStage, setGrowthStage] = useState(0);

  const stages = [
    { id: 0, name: 'Seed', image: '/assets/seed.png' },
    { id: 1, name: 'Sprout', image: '/assets/sprout.png' },
    { id: 2, name: 'Plant', image: '/assets/plant.png' },
    { id: 3, name: 'Bloom', image: '/assets/bloom.png' },
  ];

  const handleStudyProgress = () => {
    setGrowthStage((prevStage) => (prevStage < stages.length - 1 ? prevStage + 1 : prevStage));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl mb-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Growth Progress</h2>
      <div className="mb-4">
        <img
          src={stages[growthStage].image}
          alt={stages[growthStage].name}
          className="w-32 h-32 mx-auto"
        />
        <h3 className="text-lg font-bold mt-2">{stages[growthStage].name}</h3>
      </div>
      <button
        onClick={handleStudyProgress}
        className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
      >
        Study More
      </button>
    </div>
  );
};

export default Growth;