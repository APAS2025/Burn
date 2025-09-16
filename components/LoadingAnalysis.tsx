import React, { useState, useEffect } from 'react';
import { ChartLineIcon } from './Icons';

const loadingMessages = [
  "Running the numbers...",
  "Hope you're ready for the truth...",
  "Calculating the cost of that cookie.",
  "No shortcuts. No excuses. Just the numbers.",
  "Get ready to face your reality check.",
];

const LoadingAnalysis: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-8 text-center animate-[fadeIn_0.5s_ease-out]">
      <ChartLineIcon className="w-48 h-48 text-amber-400 animate-pulse" />
      
      <p key={currentMessageIndex} className="text-zinc-200 text-xl font-semibold mt-8 h-8 animate-[fadeIn_0.5s]">
        {loadingMessages[currentMessageIndex]}
      </p>

      <div className="w-full max-w-xs bg-zinc-800 rounded-full h-2.5 mt-6 overflow-hidden">
        <div 
          className="bg-amber-400 h-2.5 w-1/2 animate-[loadingBar_2s_linear_infinite]"
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;