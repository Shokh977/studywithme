import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import local video assets
import forestVideo from './assets/forrest.mp4';
import rainVideo from './assets/rain.mp4';
import oceanVideo from './assets/ocean.mp4';
import cloudVideo from './assets/cloud.mp4';
import waterfallVideo from './assets/waterfall.mp4';

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

// LofiMusicPlayer component for background music
const LofiMusicPlayer = ({ isVisible, toggleVisibility }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef(null);

  // Handle iframe load event
  const handleIframeLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {/* Hidden player */}
      <div className="fixed bottom-10 right-6 z-40" style={{ opacity: 0, pointerEvents: 'none' }}>
        <iframe
          ref={iframeRef}
          width="1"
          height="1"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&loop=1&playlist=jfKfPfyJRdk"
          title="LoFi Chill Beats"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          onLoad={handleIframeLoaded}
        ></iframe>
      </div>

      {/* Visible mini player (controlled separately) */}
      {isVisible && (
        <div className="fixed bottom-20 right-6 z-40 transition-all duration-300 transform scale-100">
          <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl">
            <iframe
              width="260"
              height="146"
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

function App() {
  const [sessionType, setSessionType] = useState('pomodoro');
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [pomodoroFormat, setPomodoroFormat] = useState('25+5'); // New state for Pomodoro format
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalSessions, setTotalSessions] = useState(2); // Default to 2 sessions
  const [showLofiPlayer, setShowLofiPlayer] = useState(false); // New state for Lofigirl player

  const audioRef = useRef(null);
  const notificationAudioRef = useRef(null);
  const videoRef = useRef(null);

  // Additional state for video background
  const [videoBackground, setVideoBackground] = useState('forest');
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  // Updated with local video sources
  const videoBackgrounds = {
    forest: forestVideo,
    rain: rainVideo,
    ocean: oceanVideo,
    clouds: cloudVideo,
    waterfall: waterfallVideo
  };

  // Background icons for selector buttons
  const backgroundIcons = {
    forest: '🌲',
    rain: '🌧️',
    ocean: '🌊',
    clouds: '☁️',
    waterfall: '💦'
  };

  // Fallback gradient backgrounds if videos fail
  const gradientBackgrounds = {
    forest: 'bg-gradient-to-br from-emerald-900 to-green-800',
    rain: 'bg-gradient-to-br from-blue-900 to-slate-800',
    ocean: 'bg-gradient-to-br from-cyan-800 to-blue-900',
    clouds: 'bg-gradient-to-br from-blue-700 to-slate-800',
    waterfall: 'bg-gradient-to-br from-teal-800 to-blue-800'
  };

  // Handle video loading and errors
  const handleVideoError = () => {
    console.error("Video failed to load:", videoBackgrounds[videoBackground]);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully:", videoBackgrounds[videoBackground]);
    setIsVideoLoading(false);
    setVideoError(false);
  };

  // Check for mobile device
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Session configuration based on format
  const sessionConfigs = {
    '25+5': {
      pomodoro: {
        duration: 25 * 60,
        label: 'Focus Time (25 min)'
      },
      'short break': {
        duration: 5 * 60,
        label: 'Short Break (5 min)'
      },
      'long break': {
        duration: 15 * 60,
        label: 'Long Break (15 min)'
      }
    },
    '50+10': {
      pomodoro: {
        duration: 50 * 60,
        label: 'Focus Time (50 min)'
      },
      'short break': {
        duration: 10 * 60,
        label: 'Short Break (10 min)'
      },
      'long break': {
        duration: 30 * 60,
        label: 'Long Break (30 min)'
      }
    }
  };

  // Get current session config based on selected format
  const sessionConfig = sessionConfigs[pomodoroFormat];

  const handleSessionChange = (selectedSession) => {
    setSessionType(selectedSession);
    setIsRunning(false);
    setIsBreak(selectedSession !== 'pomodoro');
    setTime(sessionConfig[selectedSession].duration);
  };

  const handleFormatChange = (format) => {
    setPomodoroFormat(format);
    setIsRunning(false);
    setIsBreak(false);
    setSessionsCompleted(0);
    setTime(sessionConfigs[format].pomodoro.duration);
    setSessionType('pomodoro');
  };

  // Language translations
  const translations = {
    en: {
      title: 'Study With Me',
      focusTime: 'Focus Time',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
      session: 'Session',
      sessions: 'Sessions',
      progress: 'Progress',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      playMusic: 'Play Music',
      nowPlaying: 'Now Playing',
      min: 'min',
      info: 'Info'
    },
    ko: {
      title: '함께 공부해요',
      focusTime: '집중 시간',
      shortBreak: '짧은 휴식',
      longBreak: '긴 휴식',
      session: '세션',
      sessions: '세션',
      progress: '진행 상황',
      start: '시작',
      pause: '일시정지',
      reset: '재설정',
      playMusic: '음악 재생',
      nowPlaying: '재생 중',
      min: '분',
      info: '정보'
    },
    uz: {
      title: 'Men bilan o\'qing',
      focusTime: 'Diqqat vaqti',
      shortBreak: 'Qisqa tanaffus',
      longBreak: 'Uzoq tanaffus',
      session: 'Sessiya',
      sessions: 'Sessiyalar',
      progress: 'Progress',
      start: 'Boshlash',
      pause: 'To\'xtatish',
      reset: 'Qayta o\'rnatish',
      playMusic: 'Musiqa qo\'yish',
      nowPlaying: 'Hozir ijro',
      min: 'daq',
      info: 'Ma\'lumot'
    }
  };

  // Info Modal content in different languages
  const infoContent = {
    en: {
      title: 'Study With Me - Instructions',
      content: [
        'Welcome to Study With Me, a Pomodoro technique timer that helps you study effectively.',
        'The Pomodoro Technique is a time management method that uses timed intervals (typically 25 minutes) of focused work followed by short breaks.',
        'How to use:',
        '1. Choose your preferred timer format (25+5 or 50+10)',
        '2. Select the number of sessions to complete',
        '3. Click Start to begin your focused study session',
        '4. After each focus period, take a short break',
        '5. After completing all sessions, enjoy a longer break',
        'You can customize your experience with different backgrounds, ambient particles, and study music.'
      ],
      close: 'Close'
    },
    ko: {
      title: '함께 공부해요 - 사용 방법',
      content: [
        '함께 공부해요에 오신 것을 환영합니다. 이 앱은 효과적인 학습을 위한 포모도로 타이머입니다.',
        '포모도로 기법은 일정 시간(보통 25분) 동안 집중 작업을 한 후 짧은 휴식을 취하는 시간 관리 방법입니다.',
        '사용 방법:',
        '1. 원하는 타이머 형식을 선택하세요 (25+5 또는 50+10)',
        '2. 완료할 세션 수를 선택하세요',
        '3. 시작 버튼을 클릭하여 집중 학습 세션을 시작하세요',
        '4. 각 집중 시간이 끝나면 짧은 휴식을 취하세요',
        '5. 모든 세션을 완료한 후 긴 휴식을 즐기세요',
        '다양한 배경, 입자 효과 및 학습 음악으로 경험을 맞춤설정할 수 있습니다.'
      ],
      close: '닫기'
    },
    uz: {
      title: 'Men bilan o\'qing - Ko\'rsatmalar',
      content: [
        'Men bilan o\'qing ilovasiga xush kelibsiz. Bu Pomodoro texnikasi asosidagi taymer bo\'lib, u sizga samarali o\'qishga yordam beradi.',
        'Pomodoro texnikasi - bu vaqtni boshqarish usuli bo\'lib, belgilangan vaqt oralig\'ida (odatda 25 daqiqa) diqqat bilan ishlashni va qisqa tanaffuslar bilan almashtirishni o\'z ichiga oladi.',
        'Qo\'llanma:',
        '1. O\'zingizga mos taymer formatini tanlang (25+5 yoki 50+10)',
        '2. Yakunlash kerak bo\'lgan sessiyalar sonini tanlang',
        '3. Diqqat bilan o\'qish seansini boshlash uchun "Boshlash" tugmasini bosing',
        '4. Har bir diqqat davri tugagandan so\'ng qisqa tanaffus qiling',
        '5. Barcha sessiyalarni tugatgandan so\'ng uzoqroq tanaffus qiling',
        'Turli fonlar, muhit zarrachalari va o\'qish musiqasi bilan tajribangizni sozlashingiz mumkin.'
      ],
      close: 'Yopish'
    }
  };

  // Add language state
  const [language, setLanguage] = useState('en');
  
  // Get current translations
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleTotalSessionsChange = (sessions) => {
    setTotalSessions(sessions);
    setSessionsCompleted(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSessionsCompleted(0);
    setTime(sessionConfig.pomodoro.duration);
    setSessionType('pomodoro');
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (notificationAudioRef.current) {
      notificationAudioRef.current.currentTime = 0;
      notificationAudioRef.current.play();
    }
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const changeBackground = (bgType) => {
    setVideoBackground(bgType);
    setIsVideoLoading(true);
    setVideoError(false);

    // Find the video element and update its source directly for immediate effect
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = videoBackgrounds[bgType];
      videoElement.load(); // Reload the video with the new source
      videoElement.play().catch(() => {
        setVideoError(true);
        setIsVideoLoading(false);
      });
    }
  };

  // Initialize audio for ambient music and notification sounds
  useEffect(() => {
    // Notification sound
    const notificationSoundUrl = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3";
    notificationAudioRef.current = new Audio(notificationSoundUrl);

    return () => {
      if (notificationAudioRef.current) {
        notificationAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setIsRunning(false);
            playNotificationSound();
            // When time is up, switch to the appropriate session type
            if (sessionType === 'pomodoro') {
              setSessionsCompleted((prev) => prev + 1);
              if (sessionsCompleted + 1 >= totalSessions) {
                handleSessionChange('long break');
              } else {
                handleSessionChange('short break');
              }
            } else {
              handleSessionChange('pomodoro');
            }
            return sessionConfig[sessionType].duration;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, sessionType, sessionsCompleted, totalSessions]);

  // Info Modal State
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div className={`min-h-screen ${videoError ? gradientBackgrounds[videoBackground] : 'bg-dark-bg'} text-white flex items-center justify-center relative overflow-hidden`}>
      {/* Background Video with Overlay */}
      {!videoError && (
        <div className="absolute top-0 left-0 w-full h-full">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/70">
              <div className="w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            </div>
          )}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-all duration-1000 scale-105 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
            src={videoBackgrounds[videoBackground]}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={handleVideoLoaded}
            onError={handleVideoError}
            crossOrigin="anonymous"
          />
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm"></div>
      
      {/* Main Content Container - Centered */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          
          {/* Header Section */}
          <header className="text-center mb-6 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl font-light text-gray-300 mt-2 opacity-80">
              {sessionConfig[sessionType].label}
            </p>
          </header>
          
          {/* Pomodoro Format Selector */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            {Object.keys(sessionConfigs).map((format) => (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                className={`px-3 sm:px-4 md:px-6 py-2 rounded-full text-sm sm:text-base capitalize transition-all duration-300 ${
                  pomodoroFormat === format 
                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {format}
              </button>
            ))}
          </div>

          {/* Total Sessions Selector */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            {[1, 2, 3, 4].map((sessions) => (
              <button
                key={sessions}
                onClick={() => handleTotalSessionsChange(sessions)}
                className={`px-3 sm:px-4 md:px-6 py-2 rounded-full text-sm sm:text-base capitalize transition-all duration-300 ${
                  totalSessions === sessions 
                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {sessions} {sessions === 1 ? t.session : t.sessions}
              </button>
            ))}
          </div>
          
          {/* Session Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800/50 rounded-xl p-3 text-center">
              <p className="text-gray-300 text-sm mb-2">{t.progress}</p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(totalSessions)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index < sessionsCompleted 
                        ? 'bg-green-500' 
                        : index === sessionsCompleted && !isBreak 
                          ? 'bg-amber-500' 
                          : 'bg-gray-600'
                    }`}
                    title={`${t.session} ${index + 1}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center my-4 sm:my-6 md:my-8">
            <div className="bg-black/30 backdrop-blur-lg rounded-xl px-6 py-3 sm:px-8 sm:py-4 shadow-xl border border-white/5">
              <div className={`timer-display ${isMobile ? 'text-5xl sm:text-6xl' : 'text-6xl md:text-7xl'} font-bold text-white/95 drop-shadow-lg tracking-wider`}>
                {formatTime(time)}
              </div>
              <div className="w-full h-px bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 my-2 rounded-full"></div>
              <div className="text-center text-white/60 text-xs sm:text-sm font-light">
                {isBreak ? 'Take a moment to recharge' : 'Stay focused, achieve more'}
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-4">
              <button
                onClick={startTimer}
                className="bg-gradient-to-br from-green-500/80 to-teal-600/80 hover:from-green-500 hover:to-teal-600 px-4 sm:px-6 py-2 rounded-full text-white text-sm font-medium shadow-lg"
              >
                <span className="flex items-center gap-1">
                  <span>▶️</span>
                  <span>{t.start}</span>
                </span>
              </button>
              <button
                onClick={pauseTimer}
                className="bg-gradient-to-br from-amber-500/80 to-orange-600/80 hover:from-amber-500 hover:to-orange-600 px-4 sm:px-6 py-2 rounded-full text-white text-sm font-medium shadow-lg"
              >
                <span className="flex items-center gap-1">
                  <span>⏸</span>
                  <span>{t.pause}</span>
                </span>
              </button>
              <button
                onClick={resetTimer}
                className="bg-gradient-to-br from-gray-600/80 to-gray-700/80 hover:from-gray-600 hover:to-gray-700 px-4 sm:px-6 py-2 rounded-full text-white text-sm font-medium shadow-lg"
              >
                <span className="flex items-center gap-1">
                  <span>🔄</span>
                  <span>{t.reset}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Controls - Positioned based on screen size */}
      <div className={`fixed ${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-6 left-6'} z-20`}>
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} gap-3`}>
            {/* LoFi Music Player Toggle (Renamed) */}
            <button
              onClick={() => setShowLofiPlayer(!showLofiPlayer)}
              className={`flex items-center gap-2 rounded-lg px-3 sm:px-5 py-2 transition-all duration-300 ${
                showLofiPlayer ? 'bg-pink-600/70 hover:bg-pink-600/90' : 'bg-violet-600/70 hover:bg-violet-600/90'
              }`}
            >
              <span className="text-xl">{showLofiPlayer ? '🎵' : '🎧'}</span>
              {!isMobile && <span className="font-light">{showLofiPlayer ? 'Playing Music' : 'Play Music'}</span>}
            </button>
            
            {/* Background Scene Mini-Selector */}
            <div className="flex gap-2">
              {Object.keys(videoBackgrounds).map((bg) => (
                <button
                  key={bg}
                  onClick={() => changeBackground(bg)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    videoBackground === bg 
                      ? 'ring-2 ring-white scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: bg === 'forest' ? '#2d6a4f' : bg === 'rain' ? '#1e3a8a' : bg === 'ocean' ? '#0369a1' : bg === 'clouds' ? '#9ca3af' : '#0d9488'
                  }}
                  title={bg.charAt(0).toUpperCase() + bg.slice(1)}
                >
                  <span className="text-lg">{backgroundIcons[bg]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className={`fixed ${isMobile ? 'top-4 right-4' : 'top-6 right-6'} z-20`}>
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className="flex gap-2">
            {['en', 'ko', 'uz'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-all ${
                  language === lang ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* YouTube Channel Badge */}
          <div className="mt-2 flex justify-center">
            <a 
              href="https://www.youtube.com/channel/awaken6143" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all hover:-translate-y-1 shadow-lg w-full justify-center"
              title="Visit my YouTube channel"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-medium">My Channel</span>
            </a>
          </div>
          
          {/* Calendar Widget */}
          <div className="mt-4 bg-black/40 rounded-xl overflow-hidden border border-gray-700/50">
            <div className="bg-indigo-600 text-white text-sm font-medium py-1.5 text-center">
              {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="p-2">
              <div className="grid grid-cols-7 gap-1 text-xs text-center">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                  <div key={day} className="text-gray-400 py-1">{day}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate();
                  return (
                    <div 
                      key={day}
                      className={`py-1 rounded-sm ${
                        isToday 
                          ? 'bg-purple-500 text-white font-bold' 
                          : day < new Date().getDate() 
                            ? 'bg-gray-700/30 text-gray-400' 
                            : 'bg-gray-800/40 text-gray-300'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Button and Modal */}
      <div className={`fixed ${isMobile ? 'top-4 left-4' : 'top-6 left-6'} z-20`}>
        <button
          onClick={() => setShowInfoModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg transition-all"
        >
          ℹ️ {t.info}
        </button>
      </div>
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-30">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">{infoContent[language].title}</h2>
            <ul className="text-gray-300 text-sm list-disc pl-5">
              {infoContent[language].content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
              >
                {infoContent[language].close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Music Player */}
      <BackgroundMusicPlayer isPlaying={isMusicPlaying} />

      {/* Lofi Music Player */}
      <LofiMusicPlayer isVisible={showLofiPlayer} toggleVisibility={() => setShowLofiPlayer(!showLofiPlayer)} />
    </div>
  );
}

export default App;
