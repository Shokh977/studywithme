import React, { useState, useEffect, useRef } from 'react';

const LofiMusicPlayer = ({ isVisible, toggleVisibility }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle iframe load event
  const handleIframeLoaded = () => {
    setIsLoaded(true);
  };

  // Check for mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;
  
  return (
    <>
      {isMobile ? (
        // Mobile layout - bottom of the timer in the timer container
        <div className="w-full flex justify-center mt-2 mb-3">
          <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl relative">
            <iframe
              width="280"
              height="157"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&loop=1&playlist=jfKfPfyJRdk"
              title="LoFi Chill Beats"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              className="rounded-lg shadow-xl"
            ></iframe>
            <button 
              onClick={toggleVisibility} 
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
              aria-label="Close player"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        // Desktop layout - fixed position under the calendar
        <div className="fixed top-[calc(6.5rem+30vh)] right-6 z-30">
          <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl relative">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&loop=1&playlist=jfKfPfyJRdk"
              title="LoFi Chill Beats"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              className="rounded-lg shadow-xl"
            ></iframe>
            <button 
              onClick={toggleVisibility} 
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
              aria-label="Close player"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LofiMusicPlayer;