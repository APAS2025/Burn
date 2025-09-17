import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { XIcon, MailIcon, SparklesIcon } from './Icons';
import * as authService from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, initialMode = 'signup', onSwitchMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  
  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setName('');
      setEmail('');
      setPassword('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    onSwitchMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name || !email || !password) {
          throw new Error("All fields are required for sign up.");
        }
        const newUser: User = {
          name,
          email,
          password,
          weight_kg: null,
          height_cm: null,
          sex: null,
          age: null,
          // FIX: Add missing 'subscriptionTier' property to conform to the User type.
          subscriptionTier: 'free',
          // FIX: Add missing 'primary_challenge' property to conform to the User type.
          primary_challenge: null,
        };
        const createdUser = authService.signUp(newUser);
        onAuthSuccess(createdUser);
      } else { // Login
        const user = authService.login(email, password);
        if (user) {
          onAuthSuccess(user);
        } else {
          throw new Error("Invalid email or password.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {mode === 'signup' ? 'To save your progress and insights.' : 'Log in to access your data.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          {mode === 'signup' && (
            <div className="animate-pop-in">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="Alex Doe" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="••••••••" required />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Processing...
              </>
            ) : (
              mode === 'signup' ? 'Sign Up' : 'Log In'
            )}
          </button>
        </form>

        <footer className="p-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-400">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => handleSwitchMode(mode === 'signup' ? 'login' : 'signup')} className="font-semibold text-amber-400 hover:text-amber-300 ml-2">
                    {mode === 'signup' ? 'Log In' : 'Sign Up'}
                </button>
            </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthModal;