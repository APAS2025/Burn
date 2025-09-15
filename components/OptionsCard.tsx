
import React from 'react';
import { Options } from '../types';

interface OptionsCardProps {
  options: Options;
  onOptionChange: <K extends keyof Options>(key: K, value: Options[K]) => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; }> = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-slate-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const OptionsCard: React.FC<OptionsCardProps> = ({ options, onOptionChange }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Analysis Options</h3>
      <div className="space-y-4">
        <Toggle
          label="Include Shock Factor"
          checked={options.include_shock_factor}
          onChange={(value) => onOptionChange('include_shock_factor', value)}
        />
        {options.include_shock_factor && (
          <div className="pl-4">
            <label htmlFor="servings_multiplier" className="block text-sm font-medium text-slate-400 mb-1">
              Servings Multiplier: <span className="font-bold text-cyan-400">{options.servings_multiplier}x</span>
            </label>
            <input
              type="range"
              id="servings_multiplier"
              name="servings_multiplier"
              min="1"
              max="5"
              step="1"
              value={options.servings_multiplier}
              onChange={(e) => onOptionChange('servings_multiplier', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsCard;
