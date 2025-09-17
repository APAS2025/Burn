
import React from 'react';
import { XIcon, SparklesIcon, CheckCircleIcon } from './Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const premiumFeatures = [
    "Personalized Wellness Dashboard",
    "Track Your Progress Over Time",
    "Advanced Analytics & Trends",
    "Deeper AI-Powered Insights",
    "Ad-Free Experience",
    "Priority Support",
];

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-amber-400/20 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 text-center border-b border-zinc-800 relative">
          <SparklesIcon className="w-12 h-12 mx-auto text-amber-400 mb-2" />
          <h2 className="text-2xl font-bold text-white">Unlock Premium Access</h2>
          <p className="text-zinc-400 text-sm mt-1">Take your wellness journey to the next level.</p>
           <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-4">
            <h3 className="font-semibold text-zinc-200">With Premium, you get:</h3>
            <ul className="space-y-3">
                {premiumFeatures.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <footer className="p-6 border-t border-zinc-800">
             <button
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:bg-amber-300 transition-colors transform hover:scale-[1.02]"
                // In a real app, this would trigger a payment flow.
                onClick={() => alert("Payment processing is not implemented in this demo.")}
             >
                Upgrade Now
            </button>
            <p className="text-xs text-zinc-500 text-center mt-3">
                Unlock all features and support the app's development.
            </p>
        </footer>
      </div>
    </div>
  );
};

export default UpgradeModal;