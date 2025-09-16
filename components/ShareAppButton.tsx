
import React, { useState } from 'react';
import { ShareIcon, XIcon, TwitterIcon, FacebookIcon, SmsIcon } from './Icons';

const ShareAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const appUrl = window.location.origin + window.location.pathname;
  const shareText = `Check out this eye-opening app that shows you how much exercise it takes to burn off food! It's called "Calorie Reality Check".`;
  const shareMessage = `${shareText}\n\n${appUrl}`;

  const handleSmsShare = () => {
    const smsLink = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = smsLink;
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  const socialButtons = [
    { platform: 'Facebook', icon: <FacebookIcon className="w-6 h-6" />, handler: handleFacebookShare, bg: 'bg-blue-600', delay: 'delay-75' },
    { platform: 'Twitter', icon: <TwitterIcon className="w-6 h-6" />, handler: handleTwitterShare, bg: 'bg-sky-500', delay: 'delay-150' },
    { platform: 'SMS', icon: <SmsIcon className="w-6 h-6" />, handler: handleSmsShare, bg: 'bg-green-500', delay: 'delay-200' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-4">
        {/* Social Buttons */}
        <div 
            className={`flex flex-col-reverse items-center gap-4 transition-all duration-300 ease-in-out`}
        >
            {socialButtons.map((button) => (
                 <button
                    key={button.platform}
                    onClick={button.handler}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white ${button.bg} transition-all duration-300 ease-out ${button.delay} ${isOpen ? 'transform scale-100 translate-y-0 opacity-100' : 'transform scale-90 translate-y-4 opacity-0'}`}
                    aria-label={`Share on ${button.platform}`}
                    title={`Share on ${button.platform}`}
                    style={{pointerEvents: isOpen ? 'auto' : 'none'}}
                >
                    {button.icon}
                </button>
            ))}
        </div>

        {/* Main Toggle Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-amber-400 text-zinc-900 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 z-10"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close share options" : "Open share options"}
            title={isOpen ? "Close" : "Share App"}
        >
            <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'transform rotate-45 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`}>
                <ShareIcon className="w-8 h-8" />
            </div>
            <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'transform rotate-0 scale-100 opacity-100' : 'transform -rotate-45 scale-0 opacity-0'}`}>
                <XIcon className="w-8 h-8" />
            </div>
        </button>
    </div>
  );
};

export default ShareAppButton;
