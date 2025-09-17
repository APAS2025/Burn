import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { LightbulbIcon, FlameIcon, CutleryIcon, StepIcon, ScaleIcon } from './Icons';

interface PreCalculationDashboardProps {
    user: User;
    totalCalories: number;
    itemCount: number;
    activityLabel: string;
}

const healthFacts = [
    "Staying hydrated can boost your metabolism by up to 30%.",
    "A single can of soda can contain up to 10 teaspoons of sugar.",
    "Laughing for 15 minutes can burn up to 40 calories.",
    "Your brain uses about 20% of the calories you consume.",
    "Getting enough sleep is crucial for weight management and appetite control.",
    "Fiber-rich foods like oats and beans keep you feeling full longer.",
    "Strength training builds muscle, which burns more calories at rest than fat.",
    "Walking is one of the most effective and accessible forms of exercise.",
    "Eating protein at breakfast can reduce cravings throughout the day."
];

const LiveMetric: React.FC<{ value: string | number; label: string; icon: React.ReactNode; keyVal: any; valueClassName?: string }> = ({ value, label, icon, keyVal, valueClassName="text-white" }) => (
    <div key={keyVal} className="bg-zinc-900 p-3 rounded-xl text-center animate-pulse-quick">
        {icon}
        <p className={`text-xl font-bold truncate ${valueClassName}`}>{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
    </div>
);


const PreCalculationDashboard: React.FC<PreCalculationDashboardProps> = ({ user, totalCalories, itemCount, activityLabel }) => {
    const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * healthFacts.length));
    const [isFactVisible, setIsFactVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFactVisible(false); // Start fade out
            setTimeout(() => {
                setFactIndex(prev => (prev + 1) % healthFacts.length);
                setIsFactVisible(true); // Start fade in
            }, 300); // Duration of fade-out transition
        }, 6000); // Change fact every 6 seconds
        return () => clearInterval(interval);
    }, []);

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
        <div className="w-full h-full flex flex-col gap-6 p-6 animate-pop-in">
            <div className="bg-amber-400/10 p-4 rounded-xl border border-amber-400/20">
                <div className="flex items-start gap-3">
                    <LightbulbIcon className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-amber-300">Did you know?</h4>
                        <p className={`text-sm text-zinc-300 transition-opacity duration-300 ${isFactVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {healthFacts[factIndex]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex-grow">
                 <h2 className="text-2xl font-bold text-white mb-4">
                    Hello, <span className="text-amber-400">{user.name || 'there'}</span>!
                </h2>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Live Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
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