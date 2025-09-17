import React, { useState, useEffect, useRef } from 'react';
import { Computation, User, FoodItem, SwapItem } from '../types';
import { ClipboardIcon, CheckIcon, WarningIcon, LightbulbIcon, DocumentTextIcon, XIcon, DownloadIcon, MailIcon, TwitterIcon } from './Icons';
import ReportCharts from './ReportCharts';
import EnzarkLogo from './EnzarkLogo';
import ResultItemCard from './ResultItemCard';
import FoodDatabaseModal from './FoodDatabaseModal';
import CameraAnalysisModal from './CameraAnalysisModal';
import * as storageService from '../services/storageService';
import WeeklyChallengeCard from './WeeklyChallengeCard';
import ChallengeShareButton from './ChallengeShareButton';
import { addContactToGoHighLevel } from '../services/goHighLevelService';


// Declarations for CDN libraries
declare const html2canvas: any;
declare const jspdf: any;

// A simple markdown renderer component
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
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

  // FIX: Correct the syntax of the try-catch block to properly handle errors.
  // This was causing a cascade of scope-related errors throughout the component.
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
  
  const idleButtonText = "Copy Text";

  const stateConfig = {
    idle: {
      icon: <ClipboardIcon className={iconSize} />,
      text: idleButtonText,
      className: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
    },
    copied: {
      icon: <CheckIcon className={iconSize} />,
      text: 'Copied!',
      className: 'bg-green-500/80 text-white'
    },
    error: {
      icon: <XIcon className={iconSize} />,
      text: 'Failed',
      className: 'bg-red-500/80 text-white'
    }
  };
  
  const current = stateConfig[copyState];

  return (
    <button
      onClick={handleCopy}
      disabled={copyState !== 'idle'}
      className={`flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 ${current.className} ${withLabel ? 'py-2 px-3 text-sm' : 'p-2'}`}
      title={current.text}
    >
      {current.icon}
      {withLabel && <span>{current.text}</span>}
    </button>
  );
};


interface ResultsDisplayProps {
  computation: Computation;
  user: User;
  onGamificationUpdate: (...args: Parameters<typeof storageService.updateGamificationData>) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ computation, user, onGamificationUpdate }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [swappedItems, setSwappedItems] = useState<(SwapItem | null)[]>([]);
  const [swapModalState, setSwapModalState] = useState<{ index: number | null; type: 'db' | 'camera' | null }>({ index: null, type: null });
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number | null>(null);
  const resultItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [emailCtaState, setEmailCtaState] = useState<'button' | 'form' | 'success'>('button');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const CHALLENGE_GOAL = 750;


  const { meta, items, totals, report, options, warnings } = computation;

  useEffect(() => {
    if (computation) {
        setSwappedItems(new Array(computation.items.length).fill(null));
        const progress = storageService.getWeeklyChallengeProgress();
        setChallengeProgress(progress.savedCalories);
        resultItemRefs.current = resultItemRefs.current.slice(0, items.length);
    }
  }, [computation, items.length]);

  useEffect(() => {
    const totalSaved = swappedItems.reduce((acc, currentSwap, index) => {
        if (currentSwap) {
            const originalItem = items[index];
            const diff = originalItem.calories_kcal - currentSwap.calories_kcal;
            return acc + (diff > 0 ? diff : 0);
        }
        return acc;
    }, 0);

    setChallengeProgress(totalSaved);

    const currentProgress = storageService.getWeeklyChallengeProgress();
    storageService.saveWeeklyChallengeProgress({
        ...currentProgress,
        savedCalories: totalSaved,
    });
  }, [swappedItems, items]);
  
  useEffect(() => {
    if (highlightedItemIndex !== null) {
      setTimeout(() => {
        resultItemRefs.current[highlightedItemIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); 
    }
  }, [highlightedItemIndex]);

  const handleChartSliceClick = (index: number | null) => {
    setHighlightedItemIndex(prev => (prev === index ? null : index));
  };

  const calculateBurnMinutes = (calories: number) => {
    const weight = user.weight_kg ?? meta.defaults.weight_kg;
    const met = meta.activity_profile.met;
    return (calories * 200) / (met * 3.5 * weight);
  };

  const handleAddSwap = (index: number, food: FoodItem) => {
      const burn_minutes = calculateBurnMinutes(food.calories_kcal);
      const newSwapItem: SwapItem = { ...food, burn_minutes };
      
      const newSwappedItems = [...swappedItems];
      newSwappedItems[index] = newSwapItem;
      setSwappedItems(newSwappedItems);
      
      const originalItem = items[index];
      const calorie_diff = originalItem.calories_kcal - newSwapItem.calories_kcal;
      onGamificationUpdate('HEALTHY_SWAP', { caloriesSaved: calorie_diff });
  };

  const handleRemoveSwap = (index: number) => {
      const newSwappedItems = [...swappedItems];
      newSwappedItems[index] = null;
      setSwappedItems(newSwappedItems);
  };

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    const element = document.getElementById('pdf-content');
    if (!element) return;
  
    const originalWidth = element.style.width;
    element.style.width = '1024px';
  
    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#18181b',
        logging: false
      });
  
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height],
        hotfixes: ['px_scaling'],
      });
  
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const userName = user.name ? user.name.replace(/ /g, '_') : 'user';
      pdf.save(`Enzark_Reality_Check_${userName}.pdf`);
  
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      element.style.width = originalWidth;
      setIsPdfLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setEmailError(null);
      setEmailCtaState('success');
      try {
        await addContactToGoHighLevel(email);
      } catch (error) {
        console.error("Adding contact to GHL from results failed", error);
      }
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      setEmailError(null);
    }
    setEmail(e.target.value);
  }
  
  const handleTwitterShare = () => {
    const textToShare = totals.shareable_card_text;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const emailInputClasses = `flex-grow bg-zinc-800 border rounded-lg py-3 px-4 text-white placeholder-zinc-500 focus:ring-2 focus:border-amber-400 transition ${
    emailError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-zinc-700 focus:ring-amber-400'
  }`;

  return (
    <>
    <div className="w-full h-full bg-zinc-900 rounded-2xl border border-zinc-800 animate-pop-in">
        <div id="pdf-content" className="p-6 md:p-8">
            <header className="pb-6 border-b border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <EnzarkLogo />
                    <div className="flex items-center gap-2">
                        <ShareButton text={totals.shareable_card_text} />
                         <button
                            onClick={handleTwitterShare}
                            className="flex items-center justify-center p-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-semibold rounded-lg transition-colors"
                            title="Share on Twitter"
                        >
                            <TwitterIcon className="w-5 h-5" />
                        </button>
                        <ChallengeShareButton 
                            totalCalories={totals.calories_kcal}
                            challengerName={user.name}
                        />
                    </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">{report.title}</h2>
                {user.name && <p className="text-lg text-zinc-400">Prepared for {user.name}</p>}
                
                {warnings && warnings.length > 0 && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
                    {warnings.map((warning, i) => <p key={i} className="flex gap-2"><WarningIcon className="w-5 h-5 flex-shrink-0" /> {warning}</p>)}
                    </div>
                )}
            </header>

            <section className="py-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Summary</h3>
                <div className="bg-zinc-800/50 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-white">{totals.calories_kcal.toLocaleString()}</p>
                        <p className="text-sm text-zinc-400">Total Calories</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">{Math.round(totals.eat_minutes)}</p>
                        <p className="text-sm text-zinc-400">Minutes to Eat</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">{Math.round(totals.burn_minutes / 60)}<span className="text-xl">h</span> {Math.round(totals.burn_minutes % 60)}<span className="text-xl">m</span></p>
                        <p className="text-sm text-zinc-400">Hours to Burn</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">{totals.burn_steps.toLocaleString()}</p>
                        <p className="text-sm text-zinc-400">Steps to Burn</p>
                    </div>
                </div>
                 <div className="mt-6">
                    {emailCtaState === 'button' && (
                        <button
                            onClick={() => setEmailCtaState('form')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-zinc-800 border-2 border-amber-400 text-amber-400 font-bold text-md rounded-xl shadow-lg shadow-amber-500/10 hover:bg-amber-400 hover:text-zinc-900 transition-all duration-300 group"
                        >
                            <MailIcon className="w-6 h-6 text-amber-400 group-hover:text-zinc-900 transition-colors duration-300" />
                            Email me this full report and get daily insights
                        </button>
                    )}
                    {emailCtaState === 'form' && (
                        <div className="animate-pop-in">
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="your.email@example.com"
                                required
                                className={emailInputClasses}
                                aria-label="Email for report and newsletter"
                                aria-invalid={!!emailError}
                                aria-describedby={emailError ? "email-error-results" : undefined}
                                />
                                <button
                                type="submit"
                                className="py-3 px-6 bg-amber-400 text-zinc-900 font-bold rounded-lg hover:bg-amber-300 transition-colors duration-200"
                                >
                                Send Report
                                </button>
                            </form>
                            {emailError && (
                                <p id="email-error-results" className="text-red-400 text-sm mt-2 text-left" role="alert">
                                    {emailError}
                                </p>
                            )}
                        </div>
                    )}
                    {emailCtaState === 'success' && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center justify-center gap-3 animate-pop-in">
                            <CheckIcon className="w-6 h-6" />
                            <p className="font-semibold">Success! Your report is on its way to your inbox.</p>
                        </div>
                    )}
                </div>
            </section>

            <WeeklyChallengeCard progress={challengeProgress} goal={CHALLENGE_GOAL} />
            
            <section className="py-6 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Breakdown</h3>
               <div className="space-y-4">
                  {items.map((item, index) => (
                      <ResultItemCard
                          key={index}
                          // FIX: Correct ref callback to not return a value. An arrow function with an expression body implicitly returns the value of the expression, which is invalid for a ref callback. Use a block body instead.
                          ref={el => { resultItemRefs.current[index] = el; }}
                          isHighlighted={index === highlightedItemIndex}
                          item={item}
                          options={options}
                          swappedItem={swappedItems[index]}
                          onAddSwap={(food) => handleAddSwap(index, food)}
                          onRemoveSwap={() => handleRemoveSwap(index)}
                          onRequestSwapFromDB={() => setSwapModalState({ index, type: 'db' })}
                          onRequestSwapFromCamera={() => setSwapModalState({ index, type: 'camera' })}
                      />
                  ))}
              </div>
            </section>

            {options.include_education && report.education_summary && (
              <section className="py-6 border-t border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <LightbulbIcon className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-amber-400">Educational Summary</h3>
                </div>
                <p className="text-zinc-300">{report.education_summary}</p>
              </section>
            )}

            <section className="py-6 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl font-bold text-amber-400">Full Report</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <button
                          onClick={handleDownloadPdf}
                          disabled={isPdfLoading}
                          className="flex items-center gap-2 py-2 px-3 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isPdfLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving...
                            </>
                          ) : (
                            <>
                                <DownloadIcon className="w-4 h-4" /> PDF
                            </>
                          )}
                        </button>
                        <button onClick={() => setIsReportModalOpen(true)} className="py-2 px-3 text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold rounded-lg transition-colors">
                            View Report
                        </button>
                    </div>
                </div>
                <ReportCharts
                    computation={computation}
                    theme='dark'
                    highlightedItemIndex={highlightedItemIndex}
                    onSliceClick={handleChartSliceClick}
                />
            </section>
        </div>
    </div>
    
    {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]" onClick={() => setIsReportModalOpen(false)}>
            <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-400">{report.title} - Full Report</h2>
                    <button onClick={() => setIsReportModalOpen(false)} className="text-zinc-400 hover:text-white transition-all transform hover:scale-110"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    <SimpleMarkdown content={report.details_markdown} />
                </div>
            </div>
        </div>
    )}

    <FoodDatabaseModal
      isOpen={swapModalState.type === 'db'}
      onClose={() => setSwapModalState({ index: null, type: null })}
      onAddFood={(food) => {
        if (swapModalState.index !== null) {
          handleAddSwap(swapModalState.index, food);
        }
      }}
    />
    <CameraAnalysisModal
      isOpen={swapModalState.type === 'camera'}
      onClose={() => setSwapModalState({ index: null, type: null })}
      onAddFoods={(foods) => {
        if (swapModalState.index !== null && foods.length > 0) {
          // Use the first food identified for the swap
          handleAddSwap(swapModalState.index, foods[0]);
        }
      }}
      defaultEatMinutes={5} 
      onImageAnalyzed={() => {}} // Don't add swap images to main history
    />
    </>
  );
};

export default ResultsDisplay;