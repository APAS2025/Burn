
import React, { useState } from 'react';
import { MailIcon, CheckCircleIcon } from './Icons';

const SubscriptionCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Simulate API call
      setStatus('success');
      // In a real app, you'd call your backend here.
      // e.g., subscribeUser(email);
    }
  };

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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-amber-400 text-zinc-900 font-bold rounded-lg hover:bg-amber-300 transition-colors duration-200 transform hover:scale-[1.02]"
            >
              Get My Daily Tip
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center justify-center gap-3 animate-pop-in">
            <CheckCircleIcon className="w-6 h-6" />
            <p className="font-semibold">Thank you for subscribing! Check your inbox for your first insight.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
