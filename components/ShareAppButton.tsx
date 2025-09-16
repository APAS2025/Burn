
import React from 'react';
import { ShareIcon } from './Icons';

const ShareAppButton: React.FC = () => {
  const handleShare = () => {
    const appUrl = window.location.origin + window.location.pathname;
    const message = `Check out this eye-opening app that shows you how much exercise it takes to burn off food! It's called "Calorie Reality Check".\n\n${appUrl}`;
    const smsLink = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsLink;
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-amber-400 text-zinc-900 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 animate-pop-in"
      aria-label="Share this app via text message"
      title="Share App"
    >
      <ShareIcon className="w-8 h-8" />
    </button>
  );
};

export default ShareAppButton;
