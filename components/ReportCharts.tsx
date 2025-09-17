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

// --- New SVG Donut Chart Implementation ---
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  // if the arc is a full circle, SVG has trouble, so we make it slightly less than full.
  if (endAngle - startAngle >= 360) {
    endAngle = 359.99;
  }
  
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
};

interface CalorieDonutChartProps {
    items: Computation['items'];
    totalCalories: number;
    theme: 'dark' | 'light';
    highlightedItemIndex: number | null;
    onSliceClick: (index: number | null) => void;
}

const CalorieDonutChart: React.FC<CalorieDonutChartProps> = ({ items, totalCalories, theme, highlightedItemIndex, onSliceClick }) => {
  if (totalCalories === 0) return null;

  const colorPalette = theme === 'dark' ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  const size = 160;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  let cumulativeAngle = 0;

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
  
  return (
    <div className="w-full">
        <h4 className={`text-lg font-semibold mb-3 text-center ${textStyles.totalColor}`}>Calorie Breakdown</h4>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    <g>
                        {items.map((item, index) => {
                            const percentage = (item.calories_kcal / totalCalories) * 360;
                            const startAngle = cumulativeAngle;
                            const endAngle = cumulativeAngle + percentage;
                            cumulativeAngle += percentage;
                            const isHighlighted = highlightedItemIndex === index;

                            return (
                                <path
                                    key={index}
                                    d={describeArc(center, center, radius, startAngle, endAngle - 1)}
                                    fill="none"
                                    stroke={colorPalette[index % colorPalette.length]}
                                    strokeWidth={strokeWidth}
                                    onClick={() => onSliceClick(index)}
                                    className="cursor-pointer transition-all duration-300"
                                    style={{
                                        transformOrigin: 'center center',
                                        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                                        opacity: highlightedItemIndex === null || isHighlighted ? 1 : 0.5,
                                    }}
                                />
                            );
                        })}
                    </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={`text-3xl font-bold ${textStyles.totalColor}`}>{totalCalories.toLocaleString()}</span>
                    <span className={`text-xs ${textStyles.labelColor}`}>Total kcal</span>
                </div>
            </div>
            <div className="flex-1 w-full">
                <ul className="space-y-2 text-sm">
                    {items.map((item, index) => {
                        const isHighlighted = highlightedItemIndex === index;
                        return (
                            <li
                                key={item.name}
                                className={`flex items-center gap-2 p-1 rounded-md cursor-pointer transition-all duration-300 ${isHighlighted ? 'bg-zinc-700' : 'bg-transparent hover:bg-zinc-700/50'}`}
                                onClick={() => onSliceClick(index)}
                                style={{ opacity: highlightedItemIndex === null || isHighlighted ? 1 : 0.7 }}
                            >
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                                ></span>
                                <span className={`flex-1 truncate ${textStyles.legendColor}`}>{item.name}</span>
                                <span className={`font-semibold ${textStyles.legendColor}`}>{item.calories_kcal} kcal</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    </div>
  );
};


interface ReportChartsProps {
    computation: Computation;
    theme: 'dark' | 'light';
    highlightedItemIndex: number | null;
    onSliceClick: (index: number | null) => void;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ computation, theme, highlightedItemIndex, onSliceClick }) => {
  const { totals, items } = computation;
  const containerBg = theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-50';
  const containerBorder = theme === 'dark' ? '' : 'border border-slate-200';

  return (
    <div className={`p-4 rounded-xl ${containerBg} ${containerBorder}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <EatVsBurnChart eatMinutes={totals.eat_minutes} burnMinutes={totals.burn_minutes} theme={theme} />
            <CalorieDonutChart
                items={items}
                totalCalories={totals.calories_kcal}
                theme={theme}
                highlightedItemIndex={highlightedItemIndex}
                onSliceClick={onSliceClick}
            />
        </div>
    </div>
  );
};

export default ReportCharts;