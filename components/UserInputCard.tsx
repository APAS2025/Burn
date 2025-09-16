import React from 'react';
import { User } from '../types';

interface UserInputCardProps {
  user: User;
  activity: string;
  activities: { key: string; label: string }[];
  onUserChange: (user: User) => void;
  onActivityChange: (activityKey: string) => void;
}

const UserInputCard: React.FC<UserInputCardProps> = ({ user, activity, activities, onUserChange, onActivityChange }) => {
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | null;

    if (e.target.type === 'number') {
      processedValue = value ? parseInt(value, 10) : null;
    } else {
      processedValue = value || null;
    }
    
    onUserChange({ ...user, [name]: processedValue });
  };
  
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20">
      <h3 className="text-xl font-bold text-white mb-4">Personalization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-zinc-400 mb-1">Weight (kg)</label>
          <input
            type="number"
            id="weight_kg"
            name="weight_kg"
            value={user.weight_kg || ''}
            onChange={handleUserInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="Default: 75"
          />
        </div>
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-zinc-400 mb-1">Height (cm, Optional)</label>
          <input
            type="number"
            id="height_cm"
            name="height_cm"
            value={user.height_cm || ''}
            onChange={handleUserInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="e.g., 175"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-zinc-400 mb-1">Age (Optional)</label>
          <input
            type="number"
            id="age"
            name="age"
            value={user.age || ''}
            onChange={handleUserInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-zinc-400 mb-1">Sex (Optional)</label>
          <select
            id="sex"
            name="sex"
            value={user.sex || ''}
            onChange={handleUserInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition appearance-none"
          >
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="activity" className="block text-sm font-medium text-zinc-400 mb-1">Burn Activity</label>
          <select
            id="activity"
            name="activity"
            value={activity}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition appearance-none"
          >
            {activities.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserInputCard;