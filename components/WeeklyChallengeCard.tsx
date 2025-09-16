import React from 'react';
import { TrophyIcon } from './Icons';

interface WeeklyChallengeCardProps {
  progress: number;
  goal: number;
}

const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ progress, goal }) => {
  const percentage = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
  const isComplete = progress >= goal;

  return (
    <section className="py-6 border-t border-zinc-800">
      <div className={`p-5 rounded-2xl transition-all duration-500 ${isComplete ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-zinc-800/50'}`}>
        <div className="flex items-center justify-between mb-3">
            <div>
                <h3 className={`text-xl font-bold ${isComplete ? 'text-amber-400' : 'text-white'}`}>This Week's Challenge</h3>
                <p className="text-sm text-zinc-400">Save {goal.toLocaleString()} calories with Healthy Swaps.</p>
            </div>
            {isComplete && (
                <div className="p-2 bg-amber-400 rounded-full animate-pop-in">
                    <TrophyIcon className="w-6 h-6 text-zinc-900" />
                </div>
            )}
        </div>

        {isComplete ? (
            <div className="text-center py-2">
                <p className="text-lg font-bold text-amber-300">Challenge Complete! Well done!</p>
                <p className="text-zinc-400">You've saved {Math.round(progress).toLocaleString()} calories this week.</p>
            </div>
        ) : (
            <div>
                 <div className="flex justify-between items-baseline mb-1 text-sm">
                    <span className="font-semibold text-zinc-300">Progress</span>
                    <span className="font-bold text-amber-400">{Math.round(progress).toLocaleString()} / {goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                    <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default WeeklyChallengeCard;