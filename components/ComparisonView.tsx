
import React from 'react';
import { ComputationItem } from '../types';
import { ScaleIcon, XIcon } from './Icons';

interface ComparisonViewProps {
  item1: ComputationItem;
  item2: ComputationItem;
  onClear: () => void;
  activityLabel: string;
}

const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

const ComparisonRow: React.FC<{
    label: string,
    value1: number,
    value2: number,
    formatter: (value: number) => string | number,
    unit: string,
    lowerIsBetter?: boolean
}> = ({ label, value1, value2, formatter, unit, lowerIsBetter = true }) => {

    let class1 = 'text-white';
    let class2 = 'text-white';

    if (value1 < value2) {
        class1 = lowerIsBetter ? 'text-emerald-400' : 'text-rose-400';
        class2 = lowerIsBetter ? 'text-rose-400' : 'text-emerald-400';
    } else if (value2 < value1) {
        class2 = lowerIsBetter ? 'text-emerald-400' : 'text-rose-400';
        class1 = lowerIsBetter ? 'text-rose-400' : 'text-emerald-400';
    }

    return (
        <div className="grid grid-cols-3 items-center text-center py-3 border-b border-slate-700 last:border-b-0">
            <div className={`font-semibold text-lg ${class1}`}>
                {formatter(value1)} <span className="text-sm text-slate-400">{unit}</span>
            </div>
            <div className="text-sm text-slate-300 font-medium">{label}</div>
            <div className={`font-semibold text-lg ${class2}`}>
                 {formatter(value2)} <span className="text-sm text-slate-400">{unit}</span>
            </div>
        </div>
    );
};


const ComparisonView: React.FC<ComparisonViewProps> = ({ item1, item2, onClear, activityLabel }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/30 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ScaleIcon className="w-6 h-6 text-emerald-300" />
          <h3 className="text-xl font-semibold text-white">Side-by-Side Comparison</h3>
        </div>
        <button onClick={onClear} className="text-slate-400 hover:text-white transition-all transform hover:scale-110" aria-label="Clear comparison">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center items-end">
        <div className="text-left">
            <h4 className="font-bold text-white truncate">{item1.name}</h4>
            <p className="text-xs text-slate-400">{item1.serving_label}</p>
        </div>
        <div/>
        <div className="text-right">
            <h4 className="font-bold text-white truncate">{item2.name}</h4>
            <p className="text-xs text-slate-400">{item2.serving_label}</p>
        </div>
      </div>

      <div className="mt-2 bg-slate-900/60 rounded-xl">
        <ComparisonRow 
            label="Calories" 
            value1={item1.calories_kcal} 
            value2={item2.calories_kcal} 
            formatter={(v) => v.toLocaleString()}
            unit="kcal"
        />
        <ComparisonRow 
            label="Time to Eat" 
            value1={item1.eat_minutes} 
            value2={item2.eat_minutes} 
            formatter={formatMinutes}
            unit=""
            lowerIsBetter={false}
        />
        <ComparisonRow 
            label={`Time to Burn`}
            value1={item1.burn_minutes} 
            value2={item2.burn_minutes} 
            formatter={formatMinutes}
            unit=""
        />
      </div>
    </div>
  );
};

export default ComparisonView;
