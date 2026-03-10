import React, { useState, useEffect, useRef } from 'react';
import VocabularyQuiz from './VocabularyQuiz';

const Timer = ({ showLofiPlayer, setShowLofiPlayer }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work' or 'break'
  const [cycles, setCycles] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(4);
  const [showQuiz, setShowQuiz] = useState(false);

  // Timer sound
  const timerEndSound = useRef(null);

  // Timer interval
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer ended
      setIsRunning(false);
      timerEndSound.current?.play();

      // Update cycle or change session type
      if (sessionType === 'work') {
        const newCycles = cycles + 1;
        setCycles(newCycles);

        if (newCycles % cyclesBeforeLongBreak === 0) {
          // Long break after certain number of cycles
          setSessionType('longBreak');
          setTimeLeft(longBreakDuration * 60);
        } else {
          // Regular break
          setSessionType('break');
          setTimeLeft(breakDuration * 60);
          setShowQuiz(true); // Show quiz during break
        }
      } else {
        // Back to work session after break
        setSessionType('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, cycles, workDuration, breakDuration, longBreakDuration, cyclesBeforeLongBreak]);

  const handleQuizComplete = (score) => {
    console.log(`Quiz completed with score: ${score}`);
    setShowQuiz(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle session controls
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSessionType('work');
    setTimeLeft(workDuration * 60);
    setCycles(0);
  };

  // Session label based on current type
  const sessionLabel =
    sessionType === 'work' ? 'Work Session' :
    sessionType === 'break' ? 'Short Break' : 'Long Break';

  // Background color based on session type
  const bgClass =
    sessionType === 'work' ? 'bg-red-500' :
    sessionType === 'break' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className="w-full max-w-md mx-auto">
      {showQuiz ? (
        <VocabularyQuiz onComplete={handleQuizComplete} />
      ) : (
        <div className={`rounded-xl shadow-2xl ${bgClass} p-6 mb-4`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{sessionLabel}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowLofiPlayer(!showLofiPlayer)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Toggle music player"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-7xl font-bold text-white mb-2">{formatTime(timeLeft)}</h1>
            <div className="text-white/70">Cycle {cycles + 1}</div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Timer Settings */}
      {showSettings && (
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg mb-4">
          <h3 className="text-lg font-bold mb-3">Timer Settings</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cycles before Long Break
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cyclesBeforeLongBreak}
                onChange={(e) => setCyclesBeforeLongBreak(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowSettings(false);
                if (!isRunning) {
                  setTimeLeft(
                    sessionType === 'work'
                      ? workDuration * 60
                      : sessionType === 'break'
                      ? breakDuration * 60
                      : longBreakDuration * 60
                  );
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Audio for timer completion sound */}
      <audio ref={timerEndSound}>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Lofi Player will be conditionally rendered here in the timer component container */}
    </div>
  );
};

export default Timer;