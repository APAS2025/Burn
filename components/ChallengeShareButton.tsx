import React, { useState, useEffect } from 'react';
import { ChallengeIcon, CheckIcon, XIcon } from './Icons';

const generateBeatMyMealLink = (totalCalories: number, challengerName: string | null): string => {
    // OG Data Generation
    const challenger = challengerName || 'A friend';
    const ogTitle = `${challenger} sent you a challenge!`;
    const ogDescription = `Can you create a meal with fewer than ${totalCalories.toLocaleString()} calories? Tap to accept the challenge.`;

    // Use multiple lines for the image text
    const imageText = `BEAT MY MEAL!\n${challenger} challenges you to beat\n${totalCalories.toLocaleString()} calories.`;
    const encodedImageText = encodeURIComponent(imageText);

    // Construct the dynamic image URL using an image generation service
    const ogImage = `https://placehold.co/1200x630/18181b/facc15/png?text=${encodedImageText}&font=poppins`;
    
    const compactData = {
        c: totalCalories,
        n: challengerName,
        og: {
            t: ogTitle,
            d: ogDescription,
            i: ogImage,
        }
    };

    const jsonString = JSON.stringify(compactData);
    const base64String = btoa(jsonString); // Base64 encode the JSON
    
    const url = new URL(window.location.href);
    url.search = `?beatmymeal=${encodeURIComponent(base64String)}`;
    url.hash = ''; // Clear any existing hash

    return url.toString();
};


interface ChallengeShareButtonProps {
  totalCalories: number;
  challengerName: string | null;
}

const ChallengeShareButton: React.FC<ChallengeShareButtonProps> = ({ totalCalories, challengerName }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const challengeLink = generateBeatMyMealLink(totalCalories, challengerName);

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