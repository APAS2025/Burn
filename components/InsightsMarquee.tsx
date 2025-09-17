import React from 'react';
import { PillIcon, AvocadoIcon, BodyScanIcon, PantryIcon, BloodDropIcon, BrainIcon, InfoIcon } from './Icons';

const insights = [
  { title: 'Top 5 Supplements You Should Take', icon: <PillIcon /> },
  { title: 'Good Fats vs. Bad Fats: The Real Story', icon: <AvocadoIcon /> },
  { title: 'Why You Must Get a DEXA Scan', icon: <BodyScanIcon /> },
  { title: 'Time to take your vitamins and supplements', icon: <PillIcon /> },
  { title: 'What is a MET Value? (Exercise Intensity)', icon: <InfoIcon /> },
  { title: 'First Steps to Cleaning Up Your Pantry', icon: <PantryIcon /> },
  { title: 'Key Blood Work Markers to Understand', icon: <BloodDropIcon /> },
  { title: 'The Gut-Brain Connection: Eat Smarter', icon: <BrainIcon /> },
  { title: 'Mastering Your Sleep with Simple Tricks', icon: <PillIcon /> }
];

const InsightsMarquee: React.FC = () => {
  // Duplicate the array for a seamless, infinite scrolling effect
  const duplicatedInsights = [...insights, ...insights];

  return (
    <div className="mt-12 w-full max-w-full overflow-hidden relative group">
      <div className="animate-marquee group-hover:[animation-play-state:paused] flex gap-6">
        {duplicatedInsights.map((insight, index) => (
          <div key={index} className="flex-shrink-0 w-64 bg-zinc-800/50 p-4 rounded-xl flex items-center gap-4 border border-zinc-700/50">
            <div className="flex-shrink-0 w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center text-amber-400">
              {React.cloneElement(insight.icon, { className: 'w-7 h-7' })}
            </div>
            <p className="font-semibold text-zinc-300 text-sm">{insight.title}</p>
          </div>
        ))}
      </div>
      {/* Fade effect at the edges */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-zinc-900 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default InsightsMarquee;