import React, { useState, useEffect, useLayoutEffect } from 'react';
import { OnboardingStep } from '../types';

interface OnboardingGuideProps {
  isOpen: boolean;
  steps: OnboardingStep[];
  onClose: () => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, steps, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);

  const currentStep = steps[currentStepIndex];

  const calculateRect = () => {
    if (!currentStep || !currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }
    const element = document.querySelector(currentStep.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
        // If element not found, move to next step or close
        handleNext();
    }
  };
  
  useLayoutEffect(() => {
    if (isOpen) {
      calculateRect();
    }
  }, [isOpen, currentStepIndex]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', calculateRect);
      window.addEventListener('scroll', calculateRect);
      return () => {
        window.removeEventListener('resize', calculateRect);
        window.removeEventListener('scroll', calculateRect);
      };
    }
  }, [isOpen, currentStepIndex]);


  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect) { // Centered for steps with no target
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const position = currentStep.position || 'bottom';
    const offset = 12;

    switch (position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + offset}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetRect.top + targetRect.height + offset}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + offset}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.left + targetRect.width + offset}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {};
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"></div>
      
      {targetRect && (
        <div
          className="absolute rounded-lg border-2 border-amber-400 border-dashed transition-all duration-300 pointer-events-none"
          style={{
            top: targetRect.top - 5,
            left: targetRect.left - 5,
            width: targetRect.width + 10,
            height: targetRect.height + 10,
            boxShadow: '0 0 0 9999px rgba(24, 24, 27, 0.8)',
          }}
        ></div>
      )}
      
      <div
        className="absolute w-80 max-w-[calc(100vw-2rem)] bg-zinc-800 rounded-xl border border-zinc-700 shadow-2xl p-6 transition-all duration-300 animate-pop-in"
        style={getTooltipPosition()}
      >
        <h3 className="text-xl font-bold text-amber-400 mb-2">{currentStep.title}</h3>
        <p className="text-zinc-300 text-sm mb-6">{currentStep.content}</p>

        <div className="flex justify-between items-center">
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm font-semibold">Skip</button>
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button onClick={handlePrev} className="py-2 px-4 bg-zinc-700 rounded-lg text-sm font-bold hover:bg-zinc-600 transition-colors">
                Previous
              </button>
            )}
            <button onClick={handleNext} className="py-2 px-4 bg-amber-400 text-zinc-900 rounded-lg text-sm font-bold hover:bg-amber-300 transition-colors">
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;