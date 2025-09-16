
import React from 'react';

const EnzarkLogo: React.FC<{ className?: string }> = ({ className = "w-auto h-8" }) => {
    return (
        <a href="https://enzark.com" target="_blank" rel="noopener noreferrer" aria-label="Enzark Home" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300 group">
            <span className="text-sm font-medium">Powered by</span>
            <div className={`flex items-center gap-2 ${className}`}>
                 <svg 
                    viewBox="0 0 40 40" 
                    className="h-full w-auto"
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" className="text-slate-600 group-hover:text-emerald-500 transition-colors duration-300"/>
                    <path 
                        d="M20.5 11C17.5 13.5 17.5 17.5 20.5 20C23.5 16.5 23.5 13.5 20.5 11Z" 
                        className="fill-amber-400"
                    />
                    <path 
                        d="M17 19C17 19 20.1667 20.8333 21.5 22.8333C22.8333 24.8333 21.8333 27.8333 20.5 30.1667C19.1667 32.5 15 34.5 15 34.5C15 34.5 11.1667 31.3333 10.5 27.6667C9.83333 24 13.5 20.5 17 19Z" 
                        className="fill-red-500"
                    />
                     <path 
                        d="M20.5 11C20.5 9.33333 21.5 8 23 7C24.5 6 26.5 6.5 27 8.5C27.5 10.5 25.5 13.5 23.5 15C21.5 16.5 20.5 15.5 20.5 14C20.5 12.5 20.5 11 20.5 11Z" 
                        className="fill-yellow-400"
                    />
                </svg>
                <span className="font-bold text-lg tracking-tight text-slate-300 group-hover:text-white transition-colors duration-300">
                    Enzark
                </span>
            </div>
        </a>
    );
};

export default EnzarkLogo;
