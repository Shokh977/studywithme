import React, { useEffect, useRef } from 'react';

// BackgroundMusicPlayer component using HTML5 audio element
const BackgroundMusicPlayer = ({ isPlaying, onError }) => {
  const audioRef = useRef(null);
  
  // Free music from SoundHelix
  const musicSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      if (isPlaying) {
        audioElement.play()
          .catch(error => {
            console.error("Audio autoplay failed:", error);
            if (onError) onError(error);
          });
      } else {
        audioElement.pause();
      }
    }
    
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [isPlaying, onError]);
  
  return (
    <audio 
      ref={audioRef}
      src={musicSrc}
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundMusicPlayer;