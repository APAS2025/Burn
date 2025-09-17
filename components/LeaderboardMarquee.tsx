import React, { useState, useEffect } from 'react';
import { GamificationProfile, LeaderboardEntry } from '../types';
import { getLeaderboardData } from '../services/storageService';
import { TrophyIcon } from './Icons';

interface LeaderboardMarqueeProps {
  profile: GamificationProfile;
}

const LeaderboardMarquee: React.FC<LeaderboardMarqueeProps> = ({ profile }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const data = getLeaderboardData(profile.weeklyWellnessPoints);
        // Duplicate the data for a seamless loop
        setLeaderboard([...data, ...data]);
    }, [profile.weeklyWellnessPoints]);

    if (leaderboard.length === 0) {
        return null;
    }

    return (
        <div>
            <h4 className="font-semibold text-zinc-300 mb-3">Weekly Leaderboard</h4>
            <div className="relative w-full overflow-hidden group bg-zinc-800/50 p-2 rounded-xl">
                <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
                    {leaderboard.map((entry, index) => (
                        <div
                            key={`${entry.rank}-${index}`}
                            className={`flex-shrink-0 flex items-center p-2 px-4 rounded-full mx-2 border ${
                                entry.isUser 
                                ? 'bg-amber-400/10 border-amber-400/30' 
                                : 'bg-zinc-800 border-zinc-700'
                            }`}
                        >
                            <div className="w-8 font-bold text-lg text-center flex-shrink-0">
                                {entry.rank === 1 ? <TrophyIcon className="w-5 h-5 mx-auto text-amber-400" /> : <span className="text-zinc-400">{entry.rank}</span>}
                            </div>
                            <div className="font-semibold text-white truncate mx-2 text-sm">
                                {entry.name}
                            </div>
                            <div className="font-bold text-amber-300 text-sm whitespace-nowrap">
                                {entry.points.toLocaleString()} pts
                            </div>
                        </div>
                    ))}
                </div>
                {/* Fade effect at the edges */}
                <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-zinc-800/50 via-zinc-800/25 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-zinc-800/50 via-zinc-800/25 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default LeaderboardMarquee;
