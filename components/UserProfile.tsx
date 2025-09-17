import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-amber-400 border-2 border-zinc-600">
          {getInitials(user.name)}
        </div>
        <span className="hidden md:inline font-semibold">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 animate-pop-in">
          <div className="p-2">
            <div className="px-2 py-2 border-b border-zinc-700">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-2 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
