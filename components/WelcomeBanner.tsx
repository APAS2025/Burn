import React from 'react';
import { XIcon, CookieIcon } from './Icons';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-amber-400/30 relative animate-pop-in">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
        aria-label="Dismiss welcome message"
      >
        <XIcon className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0" style={{ animation: 'intermittentShake 4s ease-in-out infinite' }}>
          <CookieIcon className="w-10 h-10 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Wait! Before you eat that...</h3>
          <p className="text-zinc-300 mt-1">
            Run a 30-second Reality Check on that processed snack (cookie, chips, soda). The result might surprise you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;