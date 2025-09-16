import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { ChallengeIcon, CheckIcon, XIcon } from './Icons';

const generateBeatMyMealLink = (items: Pick<FoodItem, 'name' | 'serving_label' | 'calories_kcal' | 'eat_minutes'>[], totalCalories: number, challengerName: string | null): string => {
    const challengeFoods = items.map(item => ({
        name: item.name,
        serving_label: item.serving_label,
        calories_kcal: item.calories_kcal,
        eat_minutes: item.eat_minutes,
    }));
    
    const challengeData = {
        foods: challengeFoods,
        totalCalories,
        challengerName,
    };

    const jsonString = JSON.stringify(challengeData);
    const base64String = btoa(jsonString);
    
    const url = new URL(window.location.href);
    url.search = `?beatmymeal=${encodeURIComponent(base64String)}`;
    url.hash = '';

    return url.toString();
};


interface ChallengeShareButtonProps {
  items: Pick<FoodItem, 'name' | 'serving_label' | 'calories_kcal' | 'eat_minutes'>[];
  totalCalories: number;
  challengerName: string | null;
}

const ChallengeShareButton: React.FC<ChallengeShareButtonProps> = ({ items, totalCalories, challengerName }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const challengeLink = generateBeatMyMealLink(items, totalCalories, challengerName);

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = setTimeout(() => setCopyState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    if (copyState !== 'idle') return;
    try {
      await navigator.clipboard.writeText(challengeLink);
      setCopyState('copied');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyState('error');
    }
  };

  const stateConfig = {
    idle: { icon: <ChallengeIcon className="w-4 h-4" />, text: 'Challenge Friend', className: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200' },
    copied: { icon: <CheckIcon className="w-4 h-4" />, text: 'Link Copied!', className: 'bg-green-500/80 text-white' },
    error: { icon: <XIcon className="w-4 h-4" />, text: 'Failed', className: 'bg-red-500/80 text-white' }
  };
  
  const current = stateConfig[copyState];

  return (
    <button
      onClick={handleCopy}
      disabled={copyState !== 'idle'}
      className={`flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 ${current.className} py-2 px-3 text-sm`}
      title={current.text}
    >
      {current.icon}
      <span>{current.text}</span>
    </button>
  );
};

export default ChallengeShareButton;
