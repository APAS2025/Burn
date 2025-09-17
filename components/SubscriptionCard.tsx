import React, { useState } from 'react';
import { MailIcon, CheckCircleIcon } from './Icons';
import InsightsMarquee from './InsightsMarquee';
import { addContactToGoHighLevel } from '../services/goHighLevelService';

const SubscriptionCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setError(null);
      setStatus('success');
      try {
        await addContactToGoHighLevel(email);
      } catch (error) {
        // Silently fail for now to not disrupt the user's experience.
        console.error("Subscription to GHL failed", error);
      }
    } else {
      setError('Please enter a valid email address.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setEmail(e.target.value);
  };

  const inputClasses = `flex-grow bg-zinc-800 border rounded-lg py-3 px-4 text-white placeholder-zinc-500 focus:ring-2 focus:border-amber-400 transition ${
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-zinc-700 focus:ring-amber-400'
  }`;

  return (
    <div className="bg-zinc-900 my-16 p-8 rounded-2xl border border-zinc-800 border-t-2 border-t-amber-400 text-center max-w-4xl mx-auto animate-pop-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-zinc-800 rounded-full border border-zinc-700">
           <MailIcon className="w-8 h-8 text-amber-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white">Unlock Daily Insights with ENZARK Recommends</h2>
      <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
        Receive a daily, scientifically-backed micro-dose of wellness. We'll send you one product recommendation—a supplement, a food item, or a crucial insight—to enhance your health journey.
      </p>

      <div className="mt-8 max-w-lg mx-auto">
        {status === 'idle' ? (
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your.email@example.com"
                required
                className={inputClasses}
                aria-label="Email for newsletter"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              <button
                type="submit"
                className="py-3 px-6 bg-amber-400 text-zinc-900 font-bold rounded-lg hover:bg-amber-300 transition-colors duration-200 transform hover:scale-[1.02]"
              >
                Get My Daily Tip
              </button>
            </form>
            {error && (
              <p id="email-error" className="text-red-400 text-sm mt-2 text-left" role="alert">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center justify-center gap-3 animate-pop-in">
            <CheckCircleIcon className="w-6 h-6" />
            <p className="font-semibold">Thank you for subscribing! Check your inbox for your first insight.</p>
          </div>
        )}
      </div>
      
      <div className="mt-10 pt-8 border-t border-zinc-800 text-sm text-zinc-500 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
              <strong className="font-semibold text-zinc-300 block mb-1">Feedback-Driven</strong>
              New insights are added daily based on your feedback.
          </div>
          <div className="md:border-x border-zinc-800 px-6">
              <strong className="font-semibold text-zinc-300 block mb-1">No Fluff, No Gimmicks</strong>
              Just pure, actionable knowledge you can trust.
          </div>
          <div>
              <strong className="font-semibold text-zinc-300 block mb-1">Nothing to Sell</strong>
              Our only goal is to inform and empower you.
          </div>
      </div>

      <InsightsMarquee />
    </div>
  );
};

export default SubscriptionCard;