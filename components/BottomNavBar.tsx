import React from 'react';
import { ChartLineIcon, PencilIcon } from './Icons';

interface BottomNavBarProps {
    activeView: 'setup' | 'results';
    setActiveView: (view: 'setup' | 'results') => void;
    isResultsDisabled: boolean;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, isResultsDisabled }) => {
    const navItems = [
        { view: 'setup' as const, label: 'Setup', icon: <PencilIcon /> },
        { view: 'results' as const, label: 'Results', icon: <ChartLineIcon />, disabled: isResultsDisabled },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-700 z-40">
            <div className="container mx-auto h-20 flex justify-around items-center">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setActiveView(item.view)}
                        disabled={item.disabled}
                        className={`flex flex-col items-center justify-center w-24 h-full text-xs font-medium transition-colors duration-200 ${
                            activeView === item.view ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-pressed={activeView === item.view}
                        aria-label={`Switch to ${item.label} view`}
                    >
                       {React.cloneElement(item.icon, { className: 'w-7 h-7' })}
                       <span className="mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;
