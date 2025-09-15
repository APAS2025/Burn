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
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Personalization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-slate-400 mb-1">Weight (kg)</label>
          <input
            type="number"
            id="weight_kg"
            name="weight_kg"
            value={user.weight_kg || ''}
            onChange={(e) => onUserChange({ ...user, weight_kg: e.target.value ? parseInt(e.target.value, 10) : null })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="Default: 75"
          />
        </div>
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-slate-400 mb-1">Height (cm, Optional)</label>
          <input
            type="number"
            id="height_cm"
            name="height_cm"
            value={user.height_cm || ''}
            onChange={(e) => onUserChange({ ...user, height_cm: e.target.value ? parseInt(e.target.value, 10) : null })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., 175"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-400 mb-1">Age (Optional)</label>
          <input
            type="number"
            id="age"
            name="age"
            value={user.age || ''}
            onChange={(e) => onUserChange({ ...user, age: e.target.value ? parseInt(e.target.value, 10) : null })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-slate-400 mb-1">Sex (Optional)</label>
          <select
            id="sex"
            name="sex"
            value={user.sex || ''}
            onChange={(e) => onUserChange({ ...user, sex: e.target.value || null })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="activity" className="block text-sm font-medium text-slate-400 mb-1">Burn Activity</label>
          <select
            id="activity"
            name="activity"
            value={activity}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
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