import React, { useState, useEffect, useMemo } from 'react';
import { User, Preferences, CustomActivity } from '../types';
import { CogIcon } from './Icons';
import CustomActivityModal from './CustomActivityModal';

interface UserInputCardProps {
  user: User;
  preferences: Preferences;
  activities: {
    default: { key: string; label: string }[];
    custom: CustomActivity[];
  };
  onUserChange: (user: User) => void;
  onPreferencesChange: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  onCustomActivitiesChange: (activities: CustomActivity[]) => void;
}

const KG_TO_LBS = 2.20462;

const UnitToggle: React.FC<{
  selectedUnit: 'kg' | 'lbs';
  onUnitChange: (unit: 'kg' | 'lbs') => void;
}> = ({ selectedUnit, onUnitChange }) => {
  return (
    <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg p-1">
      <button
        onClick={() => onUnitChange('kg')}
        className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${
          selectedUnit === 'kg' ? 'bg-amber-400 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-700'
        }`}
        aria-pressed={selectedUnit === 'kg'}
      >
        kg
      </button>
      <button
        onClick={() => onUnitChange('lbs')}
        className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${
          selectedUnit === 'lbs' ? 'bg-amber-400 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-700'
        }`}
        aria-pressed={selectedUnit === 'lbs'}
      >
        lbs
      </button>
    </div>
  );
};


const UserInputCard: React.FC<UserInputCardProps> = ({ user, preferences, activities, onUserChange, onPreferencesChange, onCustomActivitiesChange }) => {
  const [displayWeight, setDisplayWeight] = useState<string>('');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const bmiData = useMemo(() => {
    if (user.weight_kg && user.height_cm && user.weight_kg > 0 && user.height_cm > 0) {
      const heightInMeters = user.height_cm / 100;
      const bmi = user.weight_kg / (heightInMeters * heightInMeters);
      let category = '';
      let colorClass = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        colorClass = 'bg-blue-500/20 text-blue-300';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal';
        colorClass = 'bg-green-500/20 text-green-300';
      } else if (bmi >= 25 && bmi <= 29.9) {
        category = 'Overweight';
        colorClass = 'bg-amber-500/20 text-amber-300';
      } else {
        category = 'Obesity';
        colorClass = 'bg-red-500/20 text-red-300';
      }
      return { value: bmi.toFixed(1), category, colorClass };
    }
    return null;
  }, [user.weight_kg, user.height_cm]);

  useEffect(() => {
    if (user.weight_kg === null || isNaN(user.weight_kg)) {
      setDisplayWeight('');
      return;
    }

    if (preferences.weight_unit === 'lbs') {
      setDisplayWeight(Math.round(user.weight_kg * KG_TO_LBS).toString());
    } else {
      setDisplayWeight(Math.round(user.weight_kg).toString());
    }
  }, [user.weight_kg, preferences.weight_unit]);

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
  
  const handleWeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayWeight(value); // Update display immediately

    const numericValue = value ? parseFloat(value) : null;
    
    if (numericValue !== null && !isNaN(numericValue)) {
      const weightInKg = preferences.weight_unit === 'lbs'
        ? numericValue / KG_TO_LBS
        : numericValue;
      onUserChange({ ...user, weight_kg: weightInKg });
    } else {
      onUserChange({ ...user, weight_kg: null });
    }
  };
  
  return (
    <>
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20">
      <h3 className="text-xl font-bold text-white mb-4">Personalization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Name (for PDF Report)</label>
            <input
                type="text"
                id="name"
                name="name"
                value={user.name || ''}
                onChange={handleUserInputChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                placeholder="e.g., Alex Doe"
            />
        </div>

        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="weight_kg" className="block text-sm font-medium text-zinc-400 mb-1">Weight</label>
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={displayWeight}
              onChange={handleWeightInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder={preferences.weight_unit === 'kg' ? 'e.g., 75' : 'e.g., 165'}
            />
          </div>
          <div className="self-end">
             <UnitToggle
                selectedUnit={preferences.weight_unit}
                onUnitChange={(unit) => onPreferencesChange('weight_unit', unit)}
             />
          </div>
        </div>
        
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-zinc-400 mb-1">Height (cm)</label>
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
        
        {bmiData ? (
          <div className="animate-pop-in">
              <label className="block text-sm font-medium text-zinc-400 mb-1">BMI</label>
              <div className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white flex justify-between items-center h-[42px]">
                  <span className="font-bold">{bmiData.value}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${bmiData.colorClass}`}>{bmiData.category}</span>
              </div>
          </div>
        ) : (
             <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">BMI</label>
                <div className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-500 flex items-center h-[42px]">
                    Enter height & weight
                </div>
            </div>
        )}

        <div className="md:col-span-1">
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
        <div className="md:col-span-1">
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
            <div className="flex justify-between items-center mb-1">
                 <label htmlFor="activity" className="block text-sm font-medium text-zinc-400">Burn Activity</label>
                 <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-400 font-semibold transition-colors"
                 >
                    <CogIcon className="w-4 h-4" />
                    Manage
                 </button>
            </div>
          <select
            id="activity"
            name="activity"
            value={preferences.activity}
            onChange={(e) => onPreferencesChange('activity', e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition appearance-none"
          >
            <optgroup label="Default Activities">
                {activities.default.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
            </optgroup>
            {activities.custom.length > 0 && (
                <optgroup label="Your Custom Activities">
                    {activities.custom.map(({ key, label }) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </optgroup>
            )}
          </select>
        </div>
      </div>
    </div>
    {isActivityModalOpen && (
        <CustomActivityModal
            isOpen={isActivityModalOpen}
            onClose={() => setIsActivityModalOpen(false)}
            activities={preferences.custom_activities}
            onSave={onCustomActivitiesChange}
        />
    )}
    </>
  );
};

export default UserInputCard;