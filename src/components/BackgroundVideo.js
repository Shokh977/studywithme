import React from 'react';

const BackgroundVideo = ({ videoSource }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute min-w-full min-h-full object-cover"
        style={{ filter: 'brightness(0.7)' }}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;