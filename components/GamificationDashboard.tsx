import React from 'react';
import { GamificationProfile, AchievementKey } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { SparklesIcon, FlameIcon, StepIcon, HeartIcon, TargetIcon, RobotIcon, CalendarIcon } from './Icons';
import LeaderboardCard from './LeaderboardCard';

interface GamificationDashboardProps {
  profile: GamificationProfile;
}

const achievementIcons: Record<AchievementKey, React.FC<{ className?: string }>> = {
  firstStep: StepIcon,
  savvySwapper: HeartIcon,
  calorieCommando: TargetIcon,
  aiAnalyst: RobotIcon,
  weekendWarrior: CalendarIcon,
};

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ profile }) => {
  const { wellnessPoints, mindfulEatingStreak, achievements } = profile;

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20">
      <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <SparklesIcon className="w-8 h-8 mx-auto text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">{wellnessPoints.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">Total Points</p>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <FlameIcon className="w-8 h-8 mx-auto text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-white">{mindfulEatingStreak.count}</p>
          <p className="text-xs text-zinc-400">Day Streak</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-zinc-300 mb-3">Achievements</h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = achievements[ach.key];
            const IconComponent = achievementIcons[ach.key];
            return (
              <div
                key={ach.key}
                className={`group relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg text-center border transition-all duration-300 ${
                  isUnlocked ? 'bg-amber-400/10 border-amber-400/30' : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                <div className={`transition-colors duration-300 ${isUnlocked ? 'text-amber-400' : 'text-zinc-500'}`}>
                    <IconComponent className="w-8 h-8" />
                </div>
                <p className={`mt-1 text-xs font-semibold transition-colors duration-300 ${isUnlocked ? 'text-amber-300' : 'text-zinc-400'}`}>
                  {ach.name}
                </p>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-950 text-zinc-200 text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-700 shadow-lg z-10">
                  {ach.description}
                  {!isUnlocked && <span className="block text-zinc-400">(Locked)</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LeaderboardCard profile={profile} />
    </div>
  );
};

export default GamificationDashboard;