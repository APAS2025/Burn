import React from 'react';
import { Computation } from '../types';
import { FlameIcon, CutleryIcon } from './Icons';

const CHART_COLORS_DARK = ['#facc15', '#f87171', '#60a5fa', '#f472b6', '#a78bfa', '#ef4444', '#2dd4bf', '#fb923c'];
const CHART_COLORS_LIGHT = ['#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#dc2626', '#14b8a6', '#f97316'];

const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const EatVsBurnChart: React.FC<{
  eatMinutes: number;
  burnMinutes: number;
  theme: 'dark' | 'light';
}> = ({ eatMinutes, burnMinutes, theme }) => {
  const eatToBurnRatio = burnMinutes > 0 ? (eatMinutes / burnMinutes) * 100 : 0;
  const eatBarWidth = Math.min(100, Math.max(2, eatToBurnRatio)); // Ensure a minimum visible width

  const barStyles = {
    dark: {
      eatBg: 'bg-zinc-600',
      burnBg: 'bg-red-500',
      textColor: 'text-white',
      labelColor: 'text-zinc-300'
    },
    light: {
      eatBg: 'bg-slate-300',
      burnBg: 'bg-red-500',
      textColor: 'text-slate-800',
      labelColor: 'text-slate-600'
    }
  }[theme];

  return (
    <div className="w-full">
        <h4 className={`text-lg font-semibold mb-3 text-center ${barStyles.textColor}`}>Eat Time vs. Burn Time</h4>
        <div className="space-y-3">
            {/* Eat Time */}
            <div className="flex items-center gap-3">
                <CutleryIcon className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`} />
                <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-sm font-medium ${barStyles.labelColor}`}>Time to Eat</span>
                        <span className={`text-sm font-bold ${barStyles.textColor}`}>{formatMinutes(eatMinutes)}</span>
                    </div>
                    <div className={theme === 'dark' ? 'w-full bg-zinc-800 rounded-full h-2.5' : 'w-full bg-slate-200 rounded-full h-2.5'}>
                        <div className={`${barStyles.eatBg} h-2.5 rounded-full`} style={{ width: `${eatBarWidth}%` }}></div>
                    </div>
                </div>
            </div>
            {/* Burn Time */}
            <div className="flex items-center gap-3">
                <FlameIcon className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
                 <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-sm font-medium ${barStyles.labelColor}`}>Time to Burn</span>
                        <span className={`text-sm font-bold ${barStyles.textColor}`}>{formatMinutes(burnMinutes)}</span>
                    </div>
                    <div className={theme === 'dark' ? 'w-full bg-zinc-800 rounded-full h-2.5' : 'w-full bg-slate-200 rounded-full h-2.5'}>
                        <div className={`${barStyles.burnBg} h-2.5 rounded-full`} style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const CalorieDonutChart: React.FC<{
  items: Computation['items'];
  totalCalories: number;
  theme: 'dark' | 'light';
}> = ({ items, totalCalories, theme }) => {
  if (totalCalories === 0) return null;

  const colorPalette = theme === 'dark' ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;

  let cumulativePercent = 0;
  const gradientParts = items.map((item, index) => {
    const percent = (item.calories_kcal / totalCalories) * 100;
    const color = colorPalette[index % colorPalette.length];
    const start = cumulativePercent;
    cumulativePercent += percent;
    const end = cumulativePercent;
    return `${color} ${start}% ${end}%`;
  }).join(', ');
  
  const gradientStyle = {
    background: `conic-gradient(${gradientParts})`,
  };

  const textStyles = {
    dark: {
      totalColor: 'text-white',
      labelColor: 'text-zinc-400',
      legendColor: 'text-zinc-300'
    },
    light: {
      totalColor: 'text-slate-800',
      labelColor: 'text-slate-500',
      legendColor: 'text-slate-700'
    }
  }[theme];
  
  const containerBg = theme === 'dark' ? 'bg-zinc-900/60' : 'bg-slate-100';

  return (
    <div className="w-full">
        <h4 className={`text-lg font-semibold mb-3 text-center ${textStyles.totalColor}`}>Calorie Breakdown</h4>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
                <div
                    className="w-full h-full rounded-full"
                    style={gradientStyle}
                    role="img"
                    aria-label="Calorie breakdown by food item"
                ></div>
                <div className={`absolute inset-3 rounded-full ${theme === 'dark' ? 'bg-zinc-800/80' : 'bg-slate-50'}`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={`text-3xl font-bold ${textStyles.totalColor}`}>{totalCalories.toLocaleString()}</span>
                    <span className={`text-xs ${textStyles.labelColor}`}>Total kcal</span>
                </div>
            </div>
            <div className="flex-1 w-full">
                <ul className="space-y-2 text-sm">
                    {items.map((item, index) => (
                        <li key={item.name} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                            ></span>
                            <span className={`flex-1 truncate ${textStyles.legendColor}`}>{item.name}</span>
                            <span className={`font-semibold ${textStyles.legendColor}`}>{item.calories_kcal} kcal</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};


const ReportCharts: React.FC<{ computation: Computation, theme: 'dark' | 'light' }> = ({ computation, theme }) => {
  const { totals, items } = computation;
  const containerBg = theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-50';
  const containerBorder = theme === 'dark' ? '' : 'border border-slate-200';

  return (
    <div className={`p-4 rounded-xl ${containerBg} ${containerBorder}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <EatVsBurnChart eatMinutes={totals.eat_minutes} burnMinutes={totals.burn_minutes} theme={theme} />
            <CalorieDonutChart items={items} totalCalories={totals.calories_kcal} theme={theme} />
        </div>
    </div>
  );
};

export default ReportCharts;