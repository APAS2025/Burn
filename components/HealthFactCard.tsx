import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from './Icons';

const healthFacts = [
    "Staying hydrated can boost your metabolism by up to 30%.",
    "A single can of soda can contain up to 10 teaspoons of sugar.",
    "With lifestyle changes, conditions like insulin resistance and type 2 diabetes can often be improved, and sometimes even reversed.",
    "Laughing for 15 minutes can burn up to 40 calories.",
    "Your brain uses about 20% of the calories you consume.",
    "Insulin resistance and insulin sensitivity are opposites. Improving sensitivity is key for metabolic health.",
    "Getting enough sleep is crucial for weight management and appetite control.",
    "Strength training builds muscle, which burns more calories at rest than fat.",
    "Walking is one of the most effective and accessible forms of exercise.",
    "Eating protein at breakfast can reduce cravings throughout the day.",
    "Did you know? The LDL ('bad cholesterol') number on most lab reports is a calculated estimate, not a direct measurement."
];

const HealthFactCard: React.FC = () => {
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

    return (
        <div className="bg-amber-400/10 p-4 rounded-xl border border-amber-400/20 animate-pop-in">
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
    );
};

export default HealthFactCard;