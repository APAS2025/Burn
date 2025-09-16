import React from 'react';
import { Options } from '../types';

interface OptionsCardProps {
  options: Options;
  onOptionChange: <K extends keyof Options>(key: K, value: Options[K]) => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; }> = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-zinc-200">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-amber-400' : 'bg-zinc-700'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const OptionsCard: React.FC<OptionsCardProps> = ({ options, onOptionChange }) => {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 border-t-amber-500/20">
      <h3 className="text-xl font-bold text-white mb-4">Analysis Options</h3>
      <div className="space-y-6">
        <div>
          <Toggle
            label="Include Shock Factor"
            checked={options.include_shock_factor}
            onChange={(value) => onOptionChange('include_shock_factor', value)}
          />
          {options.include_shock_factor && (
            <div className="pl-2 mt-4">
              <label htmlFor="servings_multiplier" className="block text-sm font-medium text-zinc-400 mb-2">
                Servings Multiplier: <span className="font-bold text-amber-400">{options.servings_multiplier}x</span>
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
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          )}
        </div>
        <Toggle
          label="Include Educational Insights"
          checked={options.include_education}
          onChange={(value) => onOptionChange('include_education', value)}
        />
      </div>
    </div>
  );
};

export default OptionsCard;