

import React, { useState, useEffect } from 'react';
import { Computation, ComputationItem, FoodItem, User } from '../types';
import { ClipboardIcon, CheckIcon, WarningIcon, LightbulbIcon, DocumentTextIcon, XIcon, ShareIcon, FlameIcon, CutleryIcon, CameraIcon, PlusCircleIcon, CheckCircleIcon, DownloadIcon, LinkIcon } from './Icons';
import ComparisonView from './ComparisonView';
import ReportCharts from './ReportCharts';
import EnzarkLogo from './EnzarkLogo';


// Declarations for CDN libraries
declare const html2canvas: any;
declare const jspdf: any;

const generateChallengeLink = (items: ComputationItem[] | FoodItem[]): string => {
    // FIX: The type for `challengeFoods` was incorrect, causing a type error because the created objects were missing properties from the `FoodItem` interface.
    // This updates the type to accurately reflect the shape of the data being created for the challenge link, which is what App.tsx expects.
    const challengeFoods: Omit<FoodItem, 'servings' | 'base_calories_kcal' | 'base_eat_minutes'>[] = items.map(item => ({
        name: item.name,
        serving_label: item.serving_label,
        calories_kcal: item.calories_kcal,
        eat_minutes: item.eat_minutes,
    }));
    
    const jsonString = JSON.stringify(challengeFoods);
    const base64String = btoa(jsonString);
    
    const url = new URL(window.location.href);
    url.search = `?challenge=${encodeURIComponent(base64String)}`;
    
    // Clear hash if present
    url.hash = '';

    return url.toString();
};

// A simple markdown renderer component
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown to HTML conversion
    const formattedContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-white">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-zinc-200">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-amber-400">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert text-zinc-300" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};

const ShareButton: React.FC<{ text: string; withLabel?: boolean; isLink?: boolean }> = ({ text, withLabel = false, isLink = false }) => {
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
  
  const idleButtonText = isLink ? "Copy Link" : "Copy Text";

  const stateConfig = {
    idle: {
      label: isLink ? 'Copy challenge link' : 'Copy to clipboard',
      icon: isLink ? <LinkIcon className={iconSize} /> : <ClipboardIcon className={iconSize} />,
      buttonText: idleButtonText,
      labelClasses: 'bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700 text-zinc-200',
      iconClasses: 'text-zinc-400 hover:text-amber-400',
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
    const challengeLink = generateChallengeLink(items);
    
    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="aspect-[9/10] bg-zinc-900 rounded-3xl border border-amber-500/20 p-6 flex flex-col text-white shadow-2xl shadow-amber-500/10">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-amber-400">Enzark Reality Check</h2>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center my-4">
                         <div className="text-center">
                            <div className="text-sm text-zinc-400">Time to Eat</div>
                            <div className="text-4xl font-bold flex items-center gap-2">
                                <CutleryIcon className="w-6 h-6 text-zinc-400" />
                                {formatMinutes(eatTime)}
                            </div>
                        </div>
                        <div className="text-6xl font-light text-zinc-600 my-2">vs</div>
                         <div className="text-center">
                            <div className="text-sm text-red-500">Time to Burn</div>
                            <div className="text-4xl font-bold text-red-500 flex items-center gap-2">
                                <FlameIcon className="w-6 h-6" />
                                {formatMinutes(burnTime)}
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-lg font-bold">
                        {totals.calories_kcal.toLocaleString()} <span className="text-base font-normal text-zinc-400">Total Calories</span>
                    </div>

                    <div className="text-xs text-zinc-500 text-center mt-2 border-t border-zinc-700 pt-3">
                        {items.map(item => item.name).join(' • ')}
                    </div>

                    <div className="mt-auto text-center text-xs text-zinc-600 font-semibold tracking-wider pt-2">
                        POWERED BY ENZARK
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="w-full max-w-xs grid grid-cols-1 gap-3">
                       <ShareButton text={challengeLink} withLabel isLink />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <LinkIcon className="w-4 h-4" />
                        <span>Copy the link and send it to a friend!</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all transform hover:scale-110"
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
    const singleItemChallengeLink = generateChallengeLink([item]);
    return (
        <div
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-pop-in transition-all duration-200 hover:scale-[1.02] hover:border-zinc-700"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white text-lg">{item.name}</h4>
                    <p className="text-sm text-zinc-400">{item.serving_label} - {item.calories_kcal} kcal</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSelect(index)}
                        disabled={isSelectionDisabled}
                        title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                        aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                        className={`transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${isSelected ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'}`}
                    >
                        {isSelected ? <CheckCircleIcon /> : <PlusCircleIcon />}
                    </button>
                    <ShareButton text={singleItemChallengeLink} isLink />
                </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-800/70 p-3 rounded-lg text-center">
                    <div className="text-xs text-zinc-400 mb-1">Eat Time</div>
                    <div className="font-bold text-lg text-white">{formatMinutes(item.eat_minutes)}</div>
                </div>
                <div className="bg-zinc-800/70 p-3 rounded-lg text-center">
                    <div className="text-xs text-zinc-400 mb-1">Burn Time</div>
                    <div className="font-bold text-lg text-red-500">{formatMinutes(item.burn_minutes)}</div>
                </div>
            </div>
            
            {item.shock_factor && (
                 <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-300">
                        <span className="font-semibold text-amber-400">Shock Factor ({item.shock_factor.servings_multiplier}x):</span> {formatMinutes(item.shock_factor.burn_minutes)} burn time
                    </p>
                 </div>
            )}
        </div>
    );
}

const PDFReport: React.FC<{ computation: Computation, user: User }> = ({ computation, user }) => {
    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div id="pdf-report" className="p-12 bg-white text-slate-800" style={{ width: '800px', fontFamily: "'Poppins', sans-serif", minHeight: '1120px' }}>
            {/* Header */}
            <header className="flex justify-between items-start pb-6 border-b-2 border-amber-400">
                <div className="flex-1">
                    <EnzarkLogo className="h-10 mb-4"/>
                    <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">{computation.report.title}</h1>
                    <p className="text-slate-500 mt-2 text-lg">Your personalized wellness analysis.</p>
                </div>
                <div className="text-right flex-shrink-0 ml-8">
                    <p className="font-semibold text-slate-700 text-lg">{user.name || 'Personal Report'}</p>
                    <p className="text-sm text-slate-500">{reportDate}</p>
                </div>
            </header>

            {/* Summary */}
            <section className="my-10">
                <p className="text-lg text-slate-600 leading-relaxed bg-amber-50 border border-amber-200 p-6 rounded-2xl">{computation.report.summary}</p>
            </section>

            {/* Key Metrics */}
            <section className="grid grid-cols-3 gap-8 my-10">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Total Calories</div>
                        <div className="text-5xl font-bold text-amber-500 mt-2">{computation.totals.calories_kcal.toLocaleString()}</div>
                    </div>
                    <div className="text-slate-500 text-sm font-medium mt-1">kcal</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Total Burn Time</div>
                        <div className="text-5xl font-bold text-red-500 mt-2">{formatMinutes(computation.totals.burn_minutes)}</div>
                    </div>
                    <div className="text-slate-500 text-sm font-medium mt-1">based on your activity</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 text-sm font-medium">Annualized Impact</div>
                        <div className="text-5xl font-bold text-red-500 mt-2">~{computation.totals.annualized.pounds_equiv.toFixed(1)}</div>
                    </div>
                    <div className="text-slate-500 text-sm font-medium mt-1">lbs/year if eaten daily</div>
                </div>
            </section>

            {/* Visual Analysis */}
            <section className="my-12 p-8 bg-slate-50 rounded-2xl shadow-inner border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Visual Analysis</h2>
                <ReportCharts computation={computation} theme="light" />
            </section>

            {/* Itemized Breakdown */}
            <section className="my-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Itemized Breakdown</h2>
                 <div className="overflow-hidden shadow-lg border border-slate-200 rounded-2xl">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-slate-900">Food Item</th>
                                <th scope="col" className="px-3 py-4 text-center text-sm font-semibold text-slate-900">Calories</th>
                                <th scope="col" className="px-3 py-4 text-center text-sm font-semibold text-slate-900">Eat Time</th>
                                <th scope="col" className="px-3 py-4 text-center text-sm font-semibold text-slate-900">Burn Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {computation.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                                        <div className="font-medium text-slate-900">{item.name}</div>
                                        <div className="text-slate-500">{item.serving_label}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 text-center font-medium">{item.calories_kcal.toLocaleString()} kcal</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 text-center">{formatMinutes(item.eat_minutes)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-red-500 text-center font-bold">{formatMinutes(item.burn_minutes)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Inspired Actions section */}
            <section className="my-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Inspired Actions</h2>
                <div className="space-y-6 text-slate-600">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-2 text-lg">Be Mindful, Not Judgmental</h3>
                        <p>Use this report as a tool for awareness. Understanding the energy cost of food can empower you to make more mindful choices that align with your health goals. It's about balance, not perfection.</p>
                    </div>
                    {computation.report.education_summary && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2 text-lg">Key Takeaway from Today's Foods</h3>
                            <p>{computation.report.education_summary}</p>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-2 text-lg">Find Joy in Movement</h3>
                        <p>Remember that all movement counts! The "burn time" is just a number. The real goal is to find activities you genuinely enjoy. Consistency is far more important than intensity. Find your rhythm and celebrate every step.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-500 mt-16 pt-6 border-t border-slate-300">
                <p>This report was generated on {reportDate}. It is for informational purposes only. Always consult a healthcare professional for personal health advice.</p>
                <p className="mt-1 font-semibold">Powered by Enzark</p>
            </footer>
        </div>
    );
};

interface ResultsDisplayProps {
    computation: Computation;
    user: User;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ computation, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonSelection, setComparisonSelection] = useState<number[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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
  
  useEffect(() => {
    if (!isGeneratingPdf) return;

    const pdfElement = document.getElementById('pdf-report');
    if (!pdfElement) {
        setTimeout(() => setIsGeneratingPdf(false), 100);
        return;
    }
    
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        console.error("PDF generation libraries not found.");
        alert("Sorry, there was an error loading the PDF generation library. Please try again later.");
        setIsGeneratingPdf(false);
        return;
    }

    html2canvas(pdfElement, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const pdfHeight = pdfWidth / ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Enzark-Reality-Check.pdf');
      setIsGeneratingPdf(false);
    }).catch(err => {
        console.error("Error generating PDF:", err);
        alert("Sorry, an error occurred while generating the PDF.");
        setIsGeneratingPdf(false);
    });

  }, [isGeneratingPdf, computation, user]);

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
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-h-[85vh] overflow-y-auto">
      <div className="p-6">
        {computation.warnings && computation.warnings.length > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl">
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-amber-400">{computation.report.title}</h2>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Share report"
                        title="Share report"
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 border bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
                    >
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                    <button
                        onClick={() => setIsGeneratingPdf(true)}
                        disabled={isGeneratingPdf}
                        aria-label="Download PDF report"
                        title="Download PDF report"
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 border bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isGeneratingPdf ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="w-4 h-4" />
                                <span>PDF</span>
                            </>
                        )}
                    </button>
                 </div>
            </div>
            <p className="text-zinc-300 mt-2">{computation.report.summary}</p>
        </div>

        <div className="mt-6 bg-zinc-800/50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
                <span className="font-medium text-zinc-300">Total Calories</span>
                <span className="font-bold text-lg text-amber-400">{computation.totals.calories_kcal.toLocaleString()}</span>
            </div>
            <hr className="border-zinc-700" />
            <div className="flex justify-between items-center">
                <span className="font-medium text-zinc-300">Total Burn Time</span>
                <span className="font-bold text-lg text-red-500">{formatMinutes(computation.totals.burn_minutes)}</span>
            </div>
             <hr className="border-zinc-700" />
            <div className="flex justify-between items-center">
                <span className="font-medium text-zinc-300">Annualized Impact</span>
                <span className="font-bold text-lg text-red-500">~{computation.totals.annualized.pounds_equiv.toFixed(1)} lbs/yr</span>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-4">Visual Analysis</h3>
          <ReportCharts computation={computation} theme="dark" />
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
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
                <LightbulbIcon className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-semibold text-white">Educational Insights</h3>
            </div>
            
            {hasEducationalSummary && (
              <div className="mb-6 bg-zinc-800/50 p-4 rounded-xl">
                <h4 className="font-semibold text-zinc-200 mb-2">Overall Takeaway</h4>
                <p className="text-zinc-300">{computation.report.education_summary}</p>
              </div>
            )}

            {hasEducationalItems && (
                <div className="space-y-4">
                {educationalItems.map((item, index) => (
                    <div key={index} className="bg-zinc-800/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                    <div className="mt-2 text-sm space-y-2 text-zinc-300">
                        {item.education.satiety_flag && (
                            <p><span className="font-semibold text-zinc-400 mr-2">Satiety:</span> {item.education.satiety_flag}</p>
                        )}
                        {item.education.suggested_swap && (
                            <p><span className="font-semibold text-zinc-400 mr-2">Healthier Swap:</span> {item.education.suggested_swap}</p>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-semibold text-white">Detailed Analysis</h3>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <SimpleMarkdown content={computation.report.details_markdown} />
            </div>
        </div>

      </div>
    </div>
    {isModalOpen && <ShareCardModal computation={computation} onClose={() => setIsModalOpen(false)} />}
    {isGeneratingPdf && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -10 }}>
            <PDFReport computation={computation} user={user} />
        </div>
    )}
    </>
  );
};

export default ResultsDisplay;