import React from 'react';
import { GamificationProfile } from '../types';
import { REWARDS } from '../rewards';
import { XIcon, SparklesIcon, GiftIcon } from './Icons';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: GamificationProfile;
  onClaimReward: (rewardId: string) => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose, userProfile, onClaimReward }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">Partner Rewards</h2>
            <p className="text-zinc-400 text-sm">Use your points to claim real-world rewards.</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-amber-300">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-2xl font-bold">{userProfile.wellnessPoints.toLocaleString()}</span>
            </div>
            <p className="text-xs text-zinc-500">Your Wellness Points</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {REWARDS.map(reward => {
            const isClaimed = userProfile.claimedRewards?.[reward.id];
            const canAfford = userProfile.wellnessPoints >= reward.pointsRequired;
            const progress = canAfford || isClaimed ? 100 : Math.round((userProfile.wellnessPoints / reward.pointsRequired) * 100);

            return (
              <div key={reward.id} className={`p-4 rounded-xl border transition-all ${isClaimed ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-800 border-zinc-700'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-shrink-0 p-2 bg-zinc-900 rounded-full">
                    <reward.partnerLogo className="w-16 h-16" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-400">{reward.partnerName}</p>
                    <h3 className="text-lg font-bold text-white">{reward.title}</h3>
                    <p className="text-sm text-zinc-300 mt-1">{reward.description}</p>
                  </div>
                  <div className="w-full sm:w-48 text-center flex-shrink-0">
                    {isClaimed ? (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm font-semibold text-green-300">Claimed!</p>
                            <p className="text-xs text-white font-mono bg-zinc-900 p-1 rounded mt-1">{reward.rewardValue}</p>
                        </div>
                    ) : (
                        <button
                          onClick={() => onClaimReward(reward.id)}
                          disabled={!canAfford}
                          className="w-full py-2 px-4 font-bold rounded-lg transition-all duration-200 text-sm disabled:cursor-not-allowed group"
                          aria-label={`Claim ${reward.title} for ${reward.pointsRequired} points`}
                        >
                          <span className={`block transition-all duration-200 ${canAfford ? 'bg-amber-400 text-zinc-900 group-hover:bg-amber-300' : 'bg-zinc-700 text-zinc-400'} py-2 px-3 rounded-md`}>
                            Claim for {reward.pointsRequired.toLocaleString()}
                            <SparklesIcon className="w-4 h-4 inline-block ml-1" />
                          </span>
                        </button>
                    )}
                  </div>
                </div>
                {!isClaimed && (
                     <div className="mt-4">
                        <div className="flex justify-between items-baseline text-xs mb-1">
                            <span className="text-zinc-400">Progress</span>
                            <span className="font-semibold text-zinc-300">{userProfile.wellnessPoints.toLocaleString()} / {reward.pointsRequired.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${canAfford ? 'bg-amber-400' : 'bg-zinc-500'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
              </div>
            );
          })}
        </div>
        <footer className="p-4 text-center border-t border-zinc-800">
            <button onClick={onClose} className="text-zinc-400 font-semibold hover:text-white transition-colors text-sm">Close</button>
        </footer>
      </div>
    </div>
  );
};

export default RewardsModal;
