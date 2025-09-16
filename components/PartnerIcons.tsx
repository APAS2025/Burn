import React from 'react';

export const HealthySnackCoLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="24" cy="24" r="22" fill="#FDE68A" />
        <path d="M16 32C18 26 24 24 30 24" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
        <path d="M18 24C16 18 22 16 28 16" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

export const FitZoneGymLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="48" height="48" rx="24" fill="#60A5FA"/>
        <path d="M12 24H18L22 16L26 32L30 24H36" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const TechTrackFitnessLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
         <rect width="48" height="48" rx="24" fill="#4B5563"/>
        <rect x="12" y="18" width="24" height="12" rx="6" fill="#D1D5DB"/>
        <circle cx="24" cy="24" r="3" fill="#1F2937"/>
    </svg>
);
