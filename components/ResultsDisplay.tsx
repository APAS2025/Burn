import React, { useState, useEffect } from 'react';
import { Computation, ComputationItem } from '../types';
import { ClipboardIcon, CheckIcon, WarningIcon, LightbulbIcon, DocumentTextIcon, XIcon, ShareIcon, FlameIcon, CutleryIcon, CameraIcon, PlusCircleIcon, CheckCircleIcon, DownloadIcon } from './Icons';
import ComparisonView from './ComparisonView';
import ReportCharts from './ReportCharts';
import EnzarkLogo from './EnzarkLogo';


// Declarations for CDN libraries
declare const html2canvas: any;
declare const jspdf: any;

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
                       <ShareButton text={computation.totals.shareable_card_text} withLabel />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <CameraIcon className="w-4 h-4" />
                        <span>Tip: Take a screenshot to share!</span>
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
                    <ShareButton text={item.shareable_card_text} />
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

const PDFReport: React.FC<{ computation: Computation }> = ({ computation }) => {
    return (
        <div id="pdf-report" className="p-10 bg-white text-slate-800 font-sans" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Poppins', sans-serif" }}>
            <header className="flex justify-between items-center pb-4 border-b border-slate-200">
                <EnzarkLogo className="h-10"/>
                <h1 className="text-2xl font-bold text-slate-700">Calorie Reality Check</h1>
            </header>

            <section className="my-8">
                <h2 className="text-3xl font-extrabold text-amber-500">{computation.report.title}</h2>
                <p className="mt-2 text-slate-600 text-lg">{computation.report.summary}</p>
            </section>

            <section className="grid grid-cols-3 gap-6 text-center my-10">
                <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="text-sm text-slate-500">Total Calories</div>
                    <div className="text-4xl font-bold text-amber-500">{computation.totals.calories_kcal.toLocaleString()}</div>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="text-sm text-slate-500">Total Burn Time</div>
                    <div className="text-4xl font-bold text-red-600">{formatMinutes(computation.totals.burn_minutes)}</div>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="text-sm text-slate-500">Annualized</div>
                    <div className="text-4xl font-bold text-red-600">~{computation.totals.annualized.pounds_equiv.toFixed(1)} <span className="text-2xl">lbs/yr</span></div>
                </div>
            </section>
            
            <section className="my-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Visual Analysis</h3>
                <ReportCharts computation={computation} theme="light" />
            </section>

            <section>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Itemized Breakdown</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-5 bg-slate-50 font-semibold text-slate-600 text-left">
                        <div className="p-3 col-span-2">Food Item</div>
                        <div className="p-3 text-center">Calories</div>
                        <div className="p-3 text-center">Eat Time</div>
                        <div className="p-3 text-center">Burn Time</div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {computation.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 text-left items-center">
                                <div className="p-3 col-span-2">
                                    <p className="font-semibold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.serving_label}</p>
                                </div>
                                <div className="p-3 text-center font-medium text-slate-700">{item.calories_kcal.toLocaleString()} kcal</div>
                                <div className="p-3 text-center font-medium text-slate-700">{formatMinutes(item.eat_minutes)}</div>
                                <div className="p-3 text-center font-bold text-red-600">{formatMinutes(item.burn_minutes)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="text-center text-xs text-slate-500 mt-10 pt-4 border-t border-slate-200">
                Report generated on {new Date().toLocaleDateString()}. For informational purposes only. Consult a professional for health advice. Powered by Enzark.
            </footer>
        </div>
    );
};


const ResultsDisplay: React.FC<{ computation: Computation }> = ({ computation }) => {
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

  }, [isGeneratingPdf]);

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
            <PDFReport computation={computation} />
        </div>
    )}
    </>
  );
};

export default ResultsDisplay;