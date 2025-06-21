import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="border border-[#ff3cac] bg-black rounded-lg px-8 py-4">
      <div className="flex items-center justify-center space-x-4">
        <span className="text-gray-300 text-3xl font-mono tracking-widest">BATTLE ENDS IN:</span>
        <span className="text-red-500 text-5xl font-mono font-bold" style={{ textShadow: '0 0 8px rgba(255,0,0,0.5)' }}>
          {formatTime()}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer; 