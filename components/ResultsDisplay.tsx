

import React, { useState } from 'react';
import { Computation, ComputationItem } from '../types';
import { ClipboardIcon, CheckIcon, WarningIcon } from './Icons';

// A simple markdown renderer component
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown to HTML conversion
    const formattedContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-white">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-200">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-cyan-400">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert text-slate-300" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};

const ShareButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
      {copied ? <CheckIcon className="text-green-400" /> : <ClipboardIcon />}
    </button>
  );
};

const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

const ResultItemCard: React.FC<{ item: ComputationItem, activityLabel: string, includeVisualHints: boolean }> = ({ item, activityLabel, includeVisualHints }) => {
    const burnRatio = Math.max(0, (item.burn_minutes / (item.burn_minutes + item.eat_minutes)) * 100);

    return (
        <div className="bg-slate-800/60 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-sm text-slate-400">{item.serving_label} - {item.calories_kcal} kcal</p>
                </div>
                <ShareButton text={item.shareable_card_text} />
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Time to Eat:</span>
                    <span className="font-semibold text-white">{formatMinutes(item.eat_minutes)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Time to Burn ({activityLabel}):</span>
                    <span className="font-semibold text-white">{formatMinutes(item.burn_minutes)}</span>
                </div>
            </div>
            
            {includeVisualHints && (
              <div className="mt-3">
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${burnRatio}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                      <span>Eat</span>
                      <span>Burn</span>
                  </div>
              </div>
            )}
            
            {item.shock_factor && (
                 <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-slate-300">
                        <span className="font-semibold text-amber-400">Shock Factor ({item.shock_factor.servings_multiplier}x):</span> {formatMinutes(item.shock_factor.burn_minutes)} burn time
                    </p>
                 </div>
            )}
        </div>
    );
}


const ResultsDisplay: React.FC<{ computation: Computation }> = ({ computation }) => {
  const activityLabel = computation.meta.activity_profile.activity_key.split('_')[0];
  
  return (
    <div className="bg-slate-800/50 rounded-lg border border-white/10 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
      <div className="p-6">
        {computation.warnings && computation.warnings.length > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-lg">
            <div className="flex items-start">
              <WarningIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Heads up!</h4>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {computation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div>
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">{computation.report.title}</h2>
                <ShareButton text={computation.totals.shareable_card_text} />
            </div>
            <p className="text-slate-300 mt-1">{computation.report.summary}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-cyan-400">Total Calories</div>
                <div className="text-2xl font-bold text-white">{computation.totals.calories_kcal.toLocaleString()}</div>
                <div className="text-sm text-slate-500">kcal</div>
            </div>
             <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-cyan-400">Total Burn Time</div>
                <div className="text-2xl font-bold text-white">{formatMinutes(computation.totals.burn_minutes)}</div>
                <div className="text-sm text-slate-500">{activityLabel}</div>
            </div>
             <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-cyan-400">Annualized</div>
                <div className="text-2xl font-bold text-white">~{computation.totals.annualized.pounds_equiv.toFixed(1)} lbs</div>
                <div className="text-sm text-slate-500">per year</div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Per-Food Breakdown</h3>
            <div className="space-y-4">
                {computation.items.map((item, index) => (
                    <ResultItemCard 
                        key={index} 
                        item={item} 
                        activityLabel={activityLabel}
                        includeVisualHints={computation.options.include_visual_hints}
                    />
                ))}
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
            <SimpleMarkdown content={computation.report.details_markdown} />
        </div>

      </div>
    </div>
  );
};

export default ResultsDisplay;