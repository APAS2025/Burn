import React, { useState, useEffect } from 'react';
import { BeakerIcon } from './Icons';

const loadingMessages = [
  "Calibrating the calorie-to-exercise converter...",
  "Consulting with virtual nutritionists...",
  "Calculating metabolic equivalents (METs)...",
  "Translating food into footsteps...",
  "Generating your 'shock factor' analysis...",
  "Crafting your personalized report...",
  "Almost there, preparing your insights..."
];

const LoadingAnalysis: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="w-full min-h-[500px] h-full bg-slate-800/40 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center border border-slate-700 p-8 text-center animate-[fadeIn_0.5s_ease-out]">
      <div className="relative mb-6">
        <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <BeakerIcon className="relative w-16 h-16 text-emerald-300" />
      </div>
      <h3 className="text-2xl font-bold text-white">Crunching the numbers...</h3>
      
      <p key={currentMessageIndex} className="text-slate-300 mt-2 h-6 animate-[fadeIn_0.5s]">
        {loadingMessages[currentMessageIndex]}
      </p>

      <div className="w-full max-w-sm bg-slate-700 rounded-full h-2.5 mt-8">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;
