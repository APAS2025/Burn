
import React, { useState, useEffect, useMemo } from 'react';
import { User, Preferences, CustomActivity } from '../types';
import { CogIcon, MailIcon } from './Icons';
import CustomActivityModal from './CustomActivityModal';
import { USER_CHALLENGES } from '../constants';

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
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const KG_TO_LBS = 2.20462;
const CM_TO_INCHES = 0.393701;
const INCHES_TO_CM = 1 / CM_TO_INCHES;

const UnitToggle: React.FC<{
  units: { key: string; label: string }[];
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
}> = ({ units, selectedUnit, onUnitChange }) => {
  return (
    <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg p-1">
      {units.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onUnitChange(key)}
          className={`w-full px-3 rounded-md py-1 text-sm font-semibold transition-colors ${
            selectedUnit === key ? 'bg-amber-400 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-700'
          }`}
          aria-pressed={selectedUnit === key}
        >
          {label}
        </button>
      ))}
    </div>
  );
};


const UserInputCard: React.FC<UserInputCardProps> = ({ user, preferences, activities, onUserChange, onPreferencesChange, onCustomActivitiesChange, isAuthenticated, onLoginClick }) => {
  const [displayWeight, setDisplayWeight] = useState<string>('');
  const [displayFeet, setDisplayFeet] = useState<string>('');
  const [displayInches, setDisplayInches] = useState<string>('');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const weightUnits = [{ key: 'kg', label: 'kg' }, { key: 'lbs', label: 'lbs' }];
  const heightUnits = [{ key: 'cm', label: 'cm' }, { key: 'ft_in', label: 'ft/in' }];

  const selectedChallenge = useMemo(() => {
    return USER_CHALLENGES.find(c => c.key === user.primary_challenge);
  }, [user.primary_challenge]);

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
  
  useEffect(() => {
    if (user.height_cm === null || isNaN(user.height_cm)) {
        setDisplayFeet('');
        setDisplayInches('');
        return;
    }

    if (preferences.height_unit === 'ft_in') {
        const totalInches = user.height_cm * CM_TO_INCHES;
        const feet = Math.floor(totalInches / 12);
        let inches = Math.round(totalInches % 12);
        let finalFeet = feet;
        if (inches === 12) {
            finalFeet += 1;
            inches = 0;
        }
        setDisplayFeet(finalFeet.toString());
        setDisplayInches(inches.toString());
    }
  }, [user.height_cm, preferences.height_unit]);

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
    setDisplayWeight(value);

    const numericValue = value ? parseFloat(value) : null;
    
    if (numericValue !== null && !isNaN(numericValue) && numericValue >= 0) {
      const weightInKg = preferences.weight_unit === 'lbs'
        ? numericValue / KG_TO_LBS
        : numericValue;
      onUserChange({ ...user, weight_kg: weightInKg });
    } else {
      onUserChange({ ...user, weight_kg: null });
    }
  };
  
  const handleFeetInchesChange = (feetStr: string, inchesStr: string) => {
    setDisplayFeet(feetStr);
    setDisplayInches(inchesStr);

    const feet = feetStr ? parseFloat(feetStr) : 0;
    const inches = inchesStr ? parseFloat(inchesStr) : 0;

    if ((!isNaN(feet) && feet >= 0) && (!isNaN(inches) && inches >= 0)) {
        const totalInches = (feet * 12) + inches;
        const cm = totalInches * INCHES_TO_CM;
        onUserChange({ ...user, height_cm: cm });
    } else {
        onUserChange({ ...user, height_cm: null });
    }
  };

  const handleChangeChallenge = () => {
    sessionStorage.removeItem('primaryChallenge');
    onUserChange({ ...user, primary_challenge: null });
  };

  return (
    <>
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20 relative">
      {!isAuthenticated && (
        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 rounded-xl animate-pop-in">
          <MailIcon className="w-12 h-12 text-amber-400 mb-2" />
          <p className="text-white font-bold text-lg text-center">Save Your Progress</p>
          <p className="text-zinc-400 text-sm text-center mb-4">Sign up or log in to save your details for next time.</p>
          <button 
            onClick={onLoginClick}
            className="py-2 px-5 bg-amber-400 text-zinc-900 font-bold rounded-full hover:bg-amber-300 transition-colors"
          >
            Sign Up / Login
          </button>
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-4">Personalization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedChallenge && (
            <div className="md:col-span-2 bg-zinc-800 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${selectedChallenge.color}-500/10`}>
                        <selectedChallenge.icon className={`w-5 h-5 text-${selectedChallenge.color}-400`} />
                    </div>
                    <div>
                        <p className="text-xs text-zinc-400">Primary Focus</p>
                        <p className="font-semibold text-white">{selectedChallenge.title}</p>
                    </div>
                </div>
                <button onClick={handleChangeChallenge} className="text-xs font-semibold text-amber-400 hover:text-amber-300">Change</button>
            </div>
        )}
        <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
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

        <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
                 <label htmlFor="weight_kg" className="block text-sm font-medium text-zinc-400">Weight</label>
                <UnitToggle
                    units={weightUnits}
                    selectedUnit={preferences.weight_unit}
                    onUnitChange={(unit) => onPreferencesChange('weight_unit', unit as 'kg' | 'lbs')}
                />
            </div>
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={displayWeight}
              onChange={handleWeightInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder={preferences.weight_unit === 'kg' ? 'e.g., 75' : 'e.g., 165'}
              min="0"
            />
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-1">
                 <label htmlFor="height" className="block text-sm font-medium text-zinc-400">Height</label>
                 <UnitToggle
                    units={heightUnits}
                    selectedUnit={preferences.height_unit}
                    onUnitChange={(unit) => onPreferencesChange('height_unit', unit as 'cm' | 'ft_in')}
                 />
            </div>
            {preferences.height_unit === 'cm' ? (
                 <input
                    type="number"
                    id="height"
                    name="height_cm"
                    value={user.height_cm ? Math.round(user.height_cm) : ''}
                    onChange={handleUserInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                    placeholder="e.g., 175"
                    min="0"
                 />
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        id="height_ft"
                        value={displayFeet}
                        onChange={(e) => handleFeetInchesChange(e.target.value, displayInches)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                        placeholder="ft"
                        min="0"
                    />
                    <input
                        type="number"
                        id="height_in"
                        value={displayInches}
                        onChange={(e) => handleFeetInchesChange(displayFeet, e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                        placeholder="in"
                        min="0"
                        max="11"
                    />
                </div>
            )}
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