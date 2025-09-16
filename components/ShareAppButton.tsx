
import React, { useState, useEffect } from 'react';
import { ShareIcon, XIcon, TwitterIcon, FacebookIcon, SmsIcon, LinkIcon, CheckIcon } from './Icons';

const ShareAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const appUrl = window.location.origin + window.location.pathname;
  const shareText = `Check out this eye-opening app that shows you how much exercise it takes to burn off food! It's called "Calorie Reality Check".`;
  const shareMessage = `${shareText}\n\n${appUrl}`;

  useEffect(() => {
    if (copyState === 'copied') {
      const timer = setTimeout(() => {
          setCopyState('idle');
          if (isOpen) {
             setIsOpen(false);
          }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copyState, isOpen]);

  const handleSmsShare = () => {
    // Detect iOS to use the correct separator for the body parameter
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const separator = isIOS ? ';' : '?';
    const smsLink = `sms:${separator}body=${encodeURIComponent(shareMessage)}`;
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
  
  const handleCopyLink = async () => {
    if (copyState !== 'idle') return;
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopyState('copied');
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };
  
  const copyButtonConfig = {
    idle: { key: 'copy', platform: 'Copy Link', icon: <LinkIcon className="w-6 h-6" />, handler: handleCopyLink, bg: 'bg-zinc-600', delay: 'delay-75', disabled: false },
    copied: { key: 'copy', platform: 'Copied!', icon: <CheckIcon className="w-6 h-6" />, handler: () => {}, bg: 'bg-green-500', delay: 'delay-75', disabled: true },
  }[copyState];

  const shareButtons = [
    copyButtonConfig,
    { key: 'facebook', platform: 'Facebook', icon: <FacebookIcon className="w-6 h-6" />, handler: handleFacebookShare, bg: 'bg-blue-600', delay: 'delay-150', disabled: false },
    { key: 'twitter', platform: 'Twitter', icon: <TwitterIcon className="w-6 h-6" />, handler: handleTwitterShare, bg: 'bg-sky-500', delay: 'delay-200', disabled: false },
    { key: 'sms', platform: 'SMS', icon: <SmsIcon className="w-6 h-6" />, handler: handleSmsShare, bg: 'bg-green-500', delay: 'delay-250', disabled: false },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-4">
        <div className={`flex flex-col-reverse items-center gap-4 transition-all duration-300 ease-in-out`}>
            {shareButtons.map((button) => (
                 <button
                    key={button.key}
                    onClick={button.handler}
                    disabled={button.disabled}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white ${button.bg} transition-all duration-300 ease-out ${button.delay} ${isOpen ? 'transform scale-100 translate-y-0 opacity-100' : 'transform scale-90 translate-y-4 opacity-0'}`}
                    aria-label={`Share via ${button.platform}`}
                    title={`Share via ${button.platform}`}
                    style={{pointerEvents: isOpen ? 'auto' : 'none'}}
                >
                    {button.icon}
                </button>
            ))}
        </div>

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
