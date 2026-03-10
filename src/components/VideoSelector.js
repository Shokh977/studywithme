import React from 'react';

const VideoSelector = ({ videos, selectedVideo, onSelectVideo }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-white mb-2">Background Atmosphere</label>
      <select
        className="w-full p-2 bg-opacity-50 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
        value={selectedVideo}
        onChange={(e) => onSelectVideo(e.target.value)}
      >
        {Object.keys(videos).map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VideoSelector;