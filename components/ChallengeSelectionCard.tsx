
import React from 'react';
import { USER_CHALLENGES } from '../constants';

interface ChallengeSelectionCardProps {
  onSelect: (challengeKey: string) => void;
}

const ChallengeSelectionCard: React.FC<ChallengeSelectionCardProps> = ({ onSelect }) => {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20 animate-pop-in">
      <h3 className="text-xl font-bold text-white mb-1 text-center">What's your primary focus right now?</h3>
      <p className="text-zinc-400 text-sm mb-6 text-center">Select a goal to personalize your journey.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {USER_CHALLENGES.map((challenge, index) => {
          const Icon = challenge.icon;
          return (
            <button
              key={challenge.key}
              onClick={() => onSelect(challenge.key)}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`animate-pop-in bg-zinc-800 p-5 rounded-lg border-2 border-transparent text-left group hover:border-${challenge.color}-400 hover:scale-[1.03] transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-${challenge.color}-500/10 group-hover:bg-${challenge.color}-500/20 transition-colors`}>
                  <Icon className={`w-7 h-7 text-${challenge.color}-400`} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{challenge.title}</h4>
                  <p className="text-sm text-zinc-400">{challenge.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeSelectionCard;