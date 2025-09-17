

import React from 'react';
import { GamificationProfile } from '../types';
import { SparklesIcon, HeartIcon, TargetIcon, RobotIcon } from './Icons';

interface DashboardViewProps {
    profile: GamificationProfile;
}

const StatCard: React.FC<{
    // FIX: Explicitly type the 'icon' prop to accept a 'className', which is required by React.cloneElement to pass new props.
    icon: React.ReactElement<{ className?: string }>;
    value: string | number;
    label: string;
    color: string;
}> = ({ icon, value, label, color }) => (
    <div className={`bg-zinc-800 p-6 rounded-xl border border-zinc-700/50 text-center animate-pop-in`}>
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 bg-${color}-500/10`}>
            {React.cloneElement(icon, { className: `w-7 h-7 text-${color}-400` })}
        </div>
        <p className="text-4xl font-extrabold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-zinc-400">{label}</p>
    </div>
);


const DashboardView: React.FC<DashboardViewProps> = ({ profile }) => {
    return (
        <div className="animate-pop-in">
            <h2 className="text-3xl font-bold text-white mb-6">Your Wellness Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard
                    icon={<SparklesIcon />}
                    value={profile.wellnessPoints}
                    label="Total Wellness Points"
                    color="amber"
                />
                 <StatCard
                    icon={<HeartIcon />}
                    value={profile.stats.totalSwaps}
                    label="Healthy Swaps Made"
                    color="green"
                />
                <StatCard
                    icon={<TargetIcon />}
                    value={profile.stats.totalCaloriesSaved}
                    label="Total Calories Saved"
                    color="blue"
                />
                 <StatCard
                    icon={<RobotIcon />}
                    value={profile.stats.totalAiAnalyses}
                    label="AI Analyses"
                    color="purple"
                />
            </div>

            <div className="mt-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">More stats and visualizations coming soon!</h3>
                <p className="text-zinc-400">
                    As a premium member, you'll get access to advanced tracking, trend analysis, personalized insights, and much more. Thank you for your support!
                </p>
            </div>
        </div>
    );
};

export default DashboardView;