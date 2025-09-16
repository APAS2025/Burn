import React, { useState, useEffect } from 'react';
import { GamificationProfile, LeaderboardEntry } from '../types';
import { getLeaderboardData } from '../services/storageService';
import { TrophyIcon } from './Icons';

interface LeaderboardCardProps {
  profile: GamificationProfile;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ profile }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const data = getLeaderboardData(profile.weeklyWellnessPoints);
        setLeaderboard(data);
    }, [profile.weeklyWellnessPoints]);

    return (
        <div>
            <h4 className="font-semibold text-zinc-300 mb-3">Weekly Leaderboard</h4>
            <div className="space-y-2">
                {leaderboard.map((entry) => (
                    <div
                        key={entry.rank}
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                            entry.isUser ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-zinc-800'
                        }`}
                    >
                        <div className="w-8 font-bold text-lg text-center flex-shrink-0">
                            {entry.rank === 1 ? <TrophyIcon className="w-5 h-5 mx-auto text-amber-400" /> : <span className="text-zinc-400">{entry.rank}</span>}
                        </div>
                        <div className="flex-1 font-semibold text-white truncate px-2">
                            {entry.name}
                            {entry.isUser && <span className="ml-2 text-xs font-bold bg-amber-400 text-zinc-900 px-2 py-0.5 rounded-md">You</span>}
                        </div>
                        <div className="font-bold text-amber-300 text-right">
                            {entry.points.toLocaleString()} pts
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardCard;