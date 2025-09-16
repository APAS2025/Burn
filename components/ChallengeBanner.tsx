import React from 'react';
import { TrophyIcon, XIcon, ChallengeIcon } from './Icons';

interface ChallengeBannerProps {
  challengerName: string | null;
  targetCalories: number;
  currentCalories: number;
  onDismiss: () => void;
}

const ChallengeBanner: React.FC<ChallengeBannerProps> = ({ challengerName, targetCalories, currentCalories, onDismiss }) => {
    const hasWon = currentCalories < targetCalories;
    const progressPercent = targetCalories > 0 ? Math.min(100, (currentCalories / targetCalories) * 100) : 0;
    const calorieDifference = Math.abs(targetCalories - currentCalories);

    return (
        <div className="bg-zinc-900 p-5 rounded-xl border border-amber-400/30 relative animate-pop-in mb-8">
            <button onClick={onDismiss} className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors" aria-label="Dismiss challenge">
                <XIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-3">
                <ChallengeIcon className="w-8 h-8 text-amber-400" />
                <div>
                    <h3 className="text-xl font-bold text-white">Beat My Meal Challenge!</h3>
                    <p className="text-sm text-zinc-400">
                        {challengerName ? `${challengerName} challenged you to beat` : "You've been challenged to beat"} a meal of <span className="font-bold text-amber-300">{targetCalories.toLocaleString()}</span> kcal.
                    </p>
                </div>
            </div>

            {hasWon && currentCalories > 0 ? (
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <TrophyIcon className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="font-bold text-lg text-green-300">Challenge Beaten!</p>
                    <p className="text-sm text-zinc-300">You're under by {calorieDifference.toLocaleString()} calories. Well done!</p>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-baseline mb-1 text-sm">
                        <span className="font-semibold text-zinc-300">Your Meal</span>
                        <span className={`font-bold ${currentCalories > targetCalories ? 'text-red-400' : 'text-white'}`}>{currentCalories.toLocaleString()} / {targetCalories.toLocaleString()} kcal</span>
                    </div>
                     <div className="w-full bg-zinc-700 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${currentCalories > targetCalories ? 'bg-red-500' : 'bg-amber-400'}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    {currentCalories > targetCalories && (
                        <p className="text-xs text-red-400 text-right mt-1">Over by {calorieDifference.toLocaleString()} calories</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChallengeBanner;
