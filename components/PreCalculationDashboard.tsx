import React, { useMemo } from 'react';
import { User } from '../types';
import { FlameIcon, CutleryIcon, StepIcon, ScaleIcon, ChartLineIcon } from './Icons';

interface PreCalculationDashboardProps {
    user: User;
    totalCalories: number;
    itemCount: number;
    activityLabel: string;
}

const LiveMetric: React.FC<{ value: string | number; label: string; icon: React.ReactNode; keyVal: any; valueClassName?: string }> = ({ value, label, icon, keyVal, valueClassName="text-white" }) => (
    <div key={keyVal} className="bg-zinc-900 p-3 rounded-xl text-center">
        {icon}
        <p className={`text-xl font-bold truncate ${valueClassName}`}>{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
    </div>
);


const PreCalculationDashboard: React.FC<PreCalculationDashboardProps> = ({ user, totalCalories, itemCount, activityLabel }) => {
    const bmiData = useMemo(() => {
        if (user.weight_kg && user.height_cm && user.weight_kg > 0 && user.height_cm > 0) {
            const heightInMeters = user.height_cm / 100;
            const bmi = user.weight_kg / (heightInMeters * heightInMeters);
            let category = '';
            let textColorClass = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                textColorClass = 'text-blue-300';
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                category = 'Normal';
                textColorClass = 'text-green-300';
            } else if (bmi >= 25 && bmi <= 29.9) {
                category = 'Overweight';
                textColorClass = 'text-amber-300';
            } else {
                category = 'Obesity';
                textColorClass = 'text-red-300';
            }
            return { value: bmi.toFixed(1), category, textColorClass };
        }
        return null;
    }, [user.weight_kg, user.height_cm]);

    return (
        <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex flex-col h-full min-h-[500px] animate-pop-in">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-zinc-700/30 rounded-full animate-pulse">
                    <ChartLineIcon className="w-24 h-24 text-amber-400" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-white">Your Results Await</h2>
                <p className="mt-2 text-zinc-400 max-w-sm">
                    Add foods, personalize your profile, then hit 'Calculate' to get your Reality Check.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-4 text-center border-t border-zinc-700 pt-4">Live Metrics</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <LiveMetric 
                        keyVal={totalCalories} 
                        value={totalCalories.toLocaleString()} 
                        label="Calories" 
                        icon={<FlameIcon className="w-6 h-6 mx-auto text-red-400 mb-1" />}
                    />
                    <LiveMetric 
                        keyVal={itemCount} 
                        value={itemCount} 
                        label="Items" 
                        icon={<CutleryIcon className="w-6 h-6 mx-auto text-amber-400 mb-1" />}
                    />
                    
                    {bmiData ? (
                        <LiveMetric 
                            keyVal={bmiData.value} 
                            value={bmiData.value} 
                            label={bmiData.category}
                            icon={<ScaleIcon className="w-6 h-6 mx-auto text-green-400 mb-1" />}
                            valueClassName={bmiData.textColorClass}
                        />
                    ) : (
                        <div className="bg-zinc-900 p-3 rounded-xl text-center">
                            <ScaleIcon className="w-6 h-6 mx-auto text-zinc-500 mb-1" />
                            <p className="text-xl font-bold text-zinc-500">-</p>
                            <p className="text-xs text-zinc-400">BMI</p>
                        </div>
                    )}

                    <div className="bg-zinc-900 p-3 rounded-xl text-center flex flex-col justify-center">
                        <StepIcon className="w-6 h-6 mx-auto text-blue-400 mb-1" />
                        <p className="text-md font-bold text-white truncate leading-tight" title={activityLabel}>{activityLabel}</p>
                        <p className="text-xs text-zinc-400">Activity</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreCalculationDashboard;