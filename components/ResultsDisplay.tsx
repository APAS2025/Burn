
import React, { useState, useEffect } from 'react';
import { Computation, ComputationItem } from '../types';
import { ClipboardIcon, CheckIcon, WarningIcon, LightbulbIcon, DocumentTextIcon, XIcon, ShareIcon, FlameIcon, CutleryIcon, CameraIcon, PlusCircleIcon, CheckCircleIcon } from './Icons';
import ComparisonView from './ComparisonView';

// A simple markdown renderer component
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown to HTML conversion
    const formattedContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-white">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-200">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-400">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert text-slate-300" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};

const ShareButton: React.FC<{ text: string; withLabel?: boolean }> = ({ text, withLabel = false }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = setTimeout(() => setCopyState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    if (copyState !== 'idle') return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyState('error');
    }
  };

  const iconSize = withLabel ? 'w-4 h-4' : 'w-5 h-5';
  
  const stateConfig = {
    idle: {
      label: 'Copy to clipboard',
      icon: <ClipboardIcon className={iconSize} />,
      buttonText: 'Copy Text',
      labelClasses: 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200',
      iconClasses: 'text-slate-400 hover:text-emerald-400',
    },
    copied: {
      label: 'Copied!',
      icon: <CheckIcon className={iconSize} />,
      buttonText: 'Copied!',
      labelClasses: 'bg-green-500/20 text-green-400 border-transparent',
      iconClasses: 'text-green-400',
    },
    error: {
      label: 'Failed to copy',
      icon: <XIcon className={iconSize} />,
      buttonText: 'Error',
      labelClasses: 'bg-red-500/20 text-red-400 border-transparent',
      iconClasses: 'text-red-400',
    },
  }[copyState];
  
  if (withLabel) {
    return (
      <button
        onClick={handleCopy}
        aria-label={stateConfig.label}
        title={stateConfig.label}
        className={`flex items-center justify-center w-full gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 border ${stateConfig.labelClasses}`}
      >
        {stateConfig.icon}
        <span>{stateConfig.buttonText}</span>
      </button>
    );
  }
  
  return (
    <button
      onClick={handleCopy}
      aria-label={stateConfig.label}
      title={stateConfig.label}
      className={`transition-colors duration-200 ${stateConfig.iconClasses}`}
    >
      {stateConfig.icon}
    </button>
  );
};

const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const ShareCardModal: React.FC<{ computation: Computation; onClose: () => void; }> = ({ computation, onClose }) => {
    const { totals, items } = computation;
    const eatTime = totals.eat_minutes;
    const burnTime = totals.burn_minutes;
    
    const ratio = burnTime > 0 ? eatTime / burnTime : 0;
    const eatBarWidth = Math.max(5, ratio * 100);

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="aspect-[9/10] bg-slate-900 rounded-3xl border border-emerald-500/30 p-6 flex flex-col text-white shadow-2xl shadow-emerald-500/10" style={{ backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)' }}>
                    <div className="text-center">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Calorie Reality Check</h2>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center my-4">
                         <div className="text-center">
                            <div className="text-sm text-slate-400">Time to Eat</div>
                            <div className="text-4xl font-bold flex items-center gap-2">
                                <CutleryIcon className="w-6 h-6 text-slate-400" />
                                {formatMinutes(eatTime)}
                            </div>
                        </div>
                        <div className="text-6xl font-light text-slate-600 my-2">vs</div>
                         <div className="text-center">
                            <div className="text-sm text-emerald-300">Time to Burn</div>
                            <div className="text-4xl font-bold text-emerald-300 flex items-center gap-2">
                                <FlameIcon className="w-6 h-6" />
                                {formatMinutes(burnTime)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            <div className="bg-slate-500 h-3 rounded-full" style={{ width: `${eatBarWidth}%` }}></div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    <div className="text-center text-lg font-bold">
                        {totals.calories_kcal.toLocaleString()} <span className="text-base font-normal text-slate-400">Total Calories</span>
                    </div>

                    <div className="text-xs text-slate-500 text-center mt-2 border-t border-slate-700 pt-3">
                        {items.map(item => item.name).join(' • ')}
                    </div>

                    <div className="mt-auto text-center text-xs text-slate-600 font-semibold tracking-wider pt-2">
                        EAT IN MINUTES, BURN IN HOURS
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="w-full max-w-xs grid grid-cols-1 gap-3">
                       <ShareButton text={computation.totals.shareable_card_text} withLabel />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CameraIcon className="w-4 h-4" />
                        <span>Tip: Take a screenshot to share!</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all transform hover:scale-110"
                aria-label="Close modal"
            >
                <XIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const ResultItemCard: React.FC<{ 
    item: ComputationItem, 
    activityLabel: string, 
    includeVisualHints: boolean,
    index: number,
    isSelected: boolean,
    isSelectionDisabled: boolean,
    onSelect: (index: number) => void
}> = ({ item, activityLabel, includeVisualHints, index, isSelected, isSelectionDisabled, onSelect }) => {
    const burnRatio = Math.max(0, (item.burn_minutes / (item.burn_minutes + item.eat_minutes)) * 100);

    return (
        <div
            className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/80 animate-pop-in transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-emerald-900/50"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white text-lg">{item.name}</h4>
                    <p className="text-sm text-slate-300">{item.serving_label} - {item.calories_kcal} kcal</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSelect(index)}
                        disabled={isSelectionDisabled}
                        title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                        aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                        className={`transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${isSelected ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}
                    >
                        {isSelected ? <CheckCircleIcon /> : <PlusCircleIcon />}
                    </button>
                    <ShareButton text={item.shareable_card_text} />
                </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-400 mb-1">Eat Time</div>
                    <div className="font-bold text-lg text-white">{formatMinutes(item.eat_minutes)}</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-400 mb-1">Burn Time</div>
                    <div className="font-bold text-lg text-emerald-400">{formatMinutes(item.burn_minutes)}</div>
                </div>
            </div>
            
            {includeVisualHints && (
              <div className="mt-4">
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full" style={{ width: `${burnRatio}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex justify-between">
                      <span>Eat</span>
                      <span>Burn</span>
                  </div>
              </div>
            )}
            
            {item.shock_factor && (
                 <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-300">
                        <span className="font-semibold text-amber-400">Shock Factor ({item.shock_factor.servings_multiplier}x):</span> {formatMinutes(item.shock_factor.burn_minutes)} burn time
                    </p>
                 </div>
            )}
        </div>
    );
}


const ResultsDisplay: React.FC<{ computation: Computation }> = ({ computation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonSelection, setComparisonSelection] = useState<number[]>([]);
  const activityLabel = computation.meta.activity_profile.activity_key.split('_')[0];
  
  const educationalItems = computation.items.filter(item => item.education?.satiety_flag || item.education?.suggested_swap);
  const hasEducationalSummary = !!computation.report.education_summary;
  const hasEducationalItems = educationalItems.length > 0;
  const shouldRenderEducationalSection = computation.options.include_education && (hasEducationalSummary || hasEducationalItems);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleComparisonSelect = (selectedIndex: number) => {
    setComparisonSelection(prev => {
        if (prev.includes(selectedIndex)) {
            return prev.filter(index => index !== selectedIndex);
        }
        if (prev.length < 2) {
            return [...prev, selectedIndex];
        }
        return prev;
    });
  };

  return (
    <>
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/80 max-h-[85vh] overflow-y-auto">
      <div className="p-6">
        {computation.warnings && computation.warnings.length > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl">
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
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">{computation.report.title}</h2>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Share report"
                    title="Share report"
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-medium transition-colors duration-200 border bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200"
                >
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                </button>
            </div>
            <p className="text-slate-300 mt-2">{computation.report.summary}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/60 p-4 rounded-xl flex flex-col justify-center transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-emerald-300">Total Calories</div>
                <div className="text-3xl font-bold text-white flex items-baseline justify-center gap-1">
                    {computation.totals.calories_kcal.toLocaleString()}
                </div>
            </div>
             <div className="bg-slate-900/60 p-4 rounded-xl transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-emerald-300">Total Burn Time</div>
                <div className="text-3xl font-bold text-white">{formatMinutes(computation.totals.burn_minutes)}</div>
                <div className="text-xs text-slate-400 capitalize">{activityLabel}</div>
            </div>
             <div className="bg-slate-900/60 p-4 rounded-xl flex flex-col justify-center transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-emerald-300">Annualized</div>
                <div className="text-3xl font-bold text-white flex items-baseline justify-center gap-1">
                    ~{computation.totals.annualized.pounds_equiv.toFixed(1)}
                    <span className="text-base font-medium text-slate-400">lbs/yr</span>
                </div>
            </div>
        </div>

        <div className="mt-8">
            {comparisonSelection.length === 2 && (
                <ComparisonView 
                    item1={computation.items[comparisonSelection[0]]}
                    item2={computation.items[comparisonSelection[1]]}
                    onClear={() => setComparisonSelection([])}
                    activityLabel={activityLabel}
                />
            )}
            <h3 className="text-xl font-semibold text-white mb-4">Per-Food Breakdown</h3>
            <div className="space-y-4">
                {computation.items.map((item, index) => (
                    <ResultItemCard 
                        key={index} 
                        index={index}
                        item={item} 
                        activityLabel={activityLabel}
                        includeVisualHints={computation.options.include_visual_hints}
                        isSelected={comparisonSelection.includes(index)}
                        onSelect={handleComparisonSelect}
                        isSelectionDisabled={comparisonSelection.length >= 2 && !comparisonSelection.includes(index)}
                    />
                ))}
            </div>
        </div>

        {shouldRenderEducationalSection && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <LightbulbIcon className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-semibold text-white">Educational Insights</h3>
            </div>
            
            {hasEducationalSummary && (
              <div className="mb-6 bg-slate-900/60 p-4 rounded-2xl">
                <h4 className="font-semibold text-slate-200 mb-2">Overall Takeaway</h4>
                <p className="text-slate-300">{computation.report.education_summary}</p>
              </div>
            )}

            {hasEducationalItems && (
                <div className="space-y-4">
                {educationalItems.map((item, index) => (
                    <div key={index} className="bg-slate-900/60 p-4 rounded-2xl">
                    <h4 className="font-semibold text-slate-200">{item.name}</h4>
                    <div className="mt-2 text-sm space-y-2 text-slate-300">
                        {item.education.satiety_flag && (
                            <p><span className="font-semibold text-slate-400 mr-2">Satiety:</span> {item.education.satiety_flag}</p>
                        )}
                        {item.education.suggested_swap && (
                            <p><span className="font-semibold text-slate-400 mr-2">Healthier Swap:</span> {item.education.suggested_swap}</p>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 text-emerald-300" />
                <h3 className="text-xl font-semibold text-white">Detailed Analysis</h3>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl">
              <SimpleMarkdown content={computation.report.details_markdown} />
            </div>
        </div>

      </div>
    </div>
    {isModalOpen && <ShareCardModal computation={computation} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default ResultsDisplay;
