import React, { useState, useEffect, useMemo } from 'react';
import { ChartLineIcon } from './Icons';

// New, larger list of messages with placeholders for the name.
const loadingMessages = [
  "Running the numbers, {name}...",
  "Let food be your medicine, {name}.",
  "What gets measured gets managed.",
  "Connecting the dots between what you eat and how you move.",
  "{name}, visualize how your food is nourishing every cell in your body.",
  "This isn't about guilt, {name}. It's about awareness.",
  "Your journey is unique, {name}. We're tracking your progress.",
  "Transforming data into mindful decisions for you, {name}.",
  "Get ready to face your reality check, {name}.",
  "Knowledge is power. Understanding your food is the first step.",
  "{name}, every healthy choice is a step toward a better you.",
  "Compiling your personalized insights...",
  "The best project you'll ever work on is you, {name}.",
  "Believe you can and you're halfway there, {name}.",
  "Just a moment, {name}, greatness is being calculated."
];

interface LoadingAnalysisProps {
    userName: string | null;
}

const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({ userName }) => {
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
  
  // Memoize the formatted message to avoid re-computation on every render
  const formattedMessage = useMemo(() => {
    const template = loadingMessages[currentMessageIndex];
    const name = userName || 'friend'; // Fallback name
    return template.replace('{name}', name);
  }, [currentMessageIndex, userName]);


  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-8 text-center animate-[fadeIn_0.5s_ease-out]">
      <ChartLineIcon className="w-48 h-48 text-amber-400 animate-pulse" />
      
      <p key={currentMessageIndex} className="text-zinc-200 text-xl font-semibold mt-8 h-8 animate-[fadeIn_0.5s]">
        {formattedMessage}
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