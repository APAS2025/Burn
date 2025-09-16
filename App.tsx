// FIX: Import `useMemo` from React to resolve 'Cannot find name' error.
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Scenario, FoodItem, Computation, CustomActivity, GamificationProfile, ChallengeMode } from './types';
import { getDefaultScenario, ACTIVITY_LIBRARY } from './constants';
import { getCalorieAnalysis } from './services/geminiService';
import FoodInputList from './components/FoodInputList';
import UserInputCard from './components/UserInputCard';
import OptionsCard from './components/OptionsCard';
import ResultsDisplay from './components/ResultsDisplay';
import FoodDatabaseModal from './components/FoodDatabaseModal';
import CameraAnalysisModal from './components/CameraAnalysisModal';
import { PlusIcon, DatabaseIcon, CameraIcon, ChartLineIcon, ResetIcon, HistoryIcon } from './components/Icons';
import LoadingAnalysis from './components/LoadingAnalysis';
import EnzarkLogo from './components/EnzarkLogo';
import ShareAppButton from './components/ShareAppButton';
import SubscriptionCard from './components/SubscriptionCard';
import ImageGalleryModal from './components/ImageGalleryModal';
import GamificationDashboard from './components/GamificationDashboard';
import ChallengeBanner from './components/ChallengeBanner';
import RewardsModal from './components/RewardsModal';
import * as storageService from './services/storageService';


const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(() => {
    const defaultScenario = getDefaultScenario();
    const savedActivities = storageService.getCustomActivities();
    defaultScenario.preferences.custom_activities = savedActivities;
    return defaultScenario;
  });
  const [computation, setComputation] = useState<Computation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState<boolean>(false);
  const [storedImages, setStoredImages] = useState<string[]>([]);
  const [reanalyzingImage, setReanalyzingImage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'setup' | 'results'>('setup');
  const [profile, setProfile] = useState<GamificationProfile>(storageService.getGamificationProfile());
  const [challengeMode, setChallengeMode] = useState<ChallengeMode | null>(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeDataParam = urlParams.get('beatmymeal');

    if (challengeDataParam) {
        try {
            const decodedString = atob(challengeDataParam);
            const challengeData = JSON.parse(decodedString);

            // Dynamically update meta tags for rich link previews
            if (challengeData.og) {
                document.title = challengeData.og.t; // Use short key 't'
                
                const metaTagSelectors = {
                    'meta[property="og:title"]': challengeData.og.t,
                    'meta[name="twitter:title"]': challengeData.og.t,
                    'meta[property="og:description"]': challengeData.og.d, // Use 'd'
                    'meta[name="twitter:description"]': challengeData.og.d,
                    'meta[property="og:image"]': challengeData.og.i, // Use 'i'
                    'meta[name="twitter:image"]': challengeData.og.i,
                };

                for (const [selector, value] of Object.entries(metaTagSelectors)) {
                    const element = document.querySelector(selector);
                    if (element && value) {
                        element.setAttribute('content', value);
                    }
                }
            }
            
            // Set up the challenge banner using compact keys
            if (challengeData.c !== undefined && challengeData.c !== null) {
                setChallengeMode({
                    challengerName: challengeData.n || null, // 'n' for name
                    targetCalories: challengeData.c,        // 'c' for calories
                });

                // Clear the default/existing foods to start the challenge fresh
                setScenario(prevScenario => ({
                    ...prevScenario,
                    foods: [],
                }));
            }
        } catch (e) {
            console.error("Failed to parse challenge data from URL", e);
        } finally {
            // Always clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
  }, []);

  useEffect(() => {
    setStoredImages(storageService.getStoredImages());
  }, []);

  const handleGamificationUpdate = useCallback((...args: Parameters<typeof storageService.updateGamificationData>) => {
    const { updatedProfile } = storageService.updateGamificationData(...args);
    setProfile(updatedProfile);
  }, []);

  const handleClaimReward = useCallback((rewardId: string) => {
    const { updatedProfile } = storageService.claimReward(rewardId);
    setProfile(updatedProfile);
  }, []);

  const updateFood = (index: number, updatedFood: FoodItem) => {
    const newFoods = [...scenario.foods];
    newFoods[index] = updatedFood;
    setScenario({ ...scenario, foods: newFoods });
  };

  const addFood = () => {
    const defaultEatMinutes = scenario.preferences.default_eat_minutes;
    const newFood: FoodItem = {
      name: 'New Food Item',
      serving_label: '1 serving',
      calories_kcal: 100,
      eat_minutes: defaultEatMinutes,
      servings: 1,
      base_calories_kcal: 100,
      base_eat_minutes: defaultEatMinutes,
    };
    setScenario({ ...scenario, foods: [...scenario.foods, newFood] });
  };
  
  const addFoodFromDatabase = (food: FoodItem) => {
    setScenario({ ...scenario, foods: [...scenario.foods, food] });
  };

  const addFoodsFromAnalysis = (newFoods: FoodItem[]) => {
    setScenario(prev => ({ ...prev, foods: [...prev.foods, ...newFoods] }));
    handleGamificationUpdate('AI_ANALYSIS');
  };

  const removeFood = (index: number) => {
    const newFoods = scenario.foods.filter((_, i) => i !== index);
    setScenario({ ...scenario, foods: newFoods });
  };
  
  const handleCalculate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setComputation(null);
    setActiveView('results');
    try {
      // Validate foods
      if (scenario.foods.length === 0) {
        setError("Please add at least one food item.");
        setIsLoading(false);
        return;
      }

      for (const food of scenario.foods) {
        if (food.calories_kcal <= 0 || food.eat_minutes <= 0) {
            setError("Please ensure all food items have positive numbers for calories and eat minutes.");
            setIsLoading(false);
            return;
        }
      }
      
      const result = await getCalorieAnalysis(scenario);
      setComputation(result);
      handleGamificationUpdate('ANALYSIS_COMPLETE');
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [scenario, handleGamificationUpdate]);

  const handleReset = useCallback(() => {
    const scenario = getDefaultScenario();
    // Keep custom activities on reset
    scenario.preferences.custom_activities = storageService.getCustomActivities();
    setScenario(scenario);
    setComputation(null);
    setError(null);
    setActiveView('setup');
    setChallengeMode(null);
  }, []);

  const handleImageAnalyzed = (imageData: string) => {
    const newImages = storageService.addStoredImage(imageData);
    setStoredImages(newImages);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = storageService.deleteStoredImage(index);
    setStoredImages(newImages);
  };
  
  const handleSelectImageFromGallery = (imageData: string) => {
    setReanalyzingImage(imageData);
    setIsGalleryModalOpen(false);
    setIsCameraModalOpen(true);
  };
  
  const handleCustomActivitiesChange = (activities: CustomActivity[]) => {
    storageService.saveCustomActivities(activities);
    
    // If the currently selected activity was deleted, reset to default
    const currentActivityKey = scenario.preferences.activity;
    const isSelectedActivityStillPresent = 
        Object.keys(ACTIVITY_LIBRARY).includes(currentActivityKey) ||
        activities.some(a => a.key === currentActivityKey);

    setScenario(prev => ({
        ...prev,
        preferences: {
            ...prev.preferences,
            custom_activities: activities,
            activity: isSelectedActivityStillPresent ? currentActivityKey : 'walking_3_mph',
        }
    }));
  };

  const allActivities = useMemo(() => {
    const defaultActivities = Object.entries(ACTIVITY_LIBRARY).map(([key, value]) => ({ key, ...value }));
    return {
        default: defaultActivities,
        custom: scenario.preferences.custom_activities,
    };
  }, [scenario.preferences.custom_activities]);

  const currentTotalCalories = useMemo(() => {
    return scenario.foods.reduce((acc, food) => acc + Math.round(food.calories_kcal), 0);
  }, [scenario.foods]);

  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight pt-12 md:pt-16">
            <span className="block text-amber-400">The Hidden Equation</span>
            <span className="block text-white">You Can't Ignore.</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Discover the surprising amount of exercise needed to burn off your favorite foods.
          </p>
        </header>

        {/* Mobile View Toggle */}
        <div className="lg:hidden mb-6">
            <div className="flex bg-zinc-800 border border-zinc-700 rounded-xl p-1">
                <button
                    onClick={() => setActiveView('setup')}
                    className={`w-1/2 rounded-lg py-2.5 text-sm font-bold transition-colors ${
                        activeView === 'setup' ? 'bg-amber-400 text-zinc-900 shadow-md' : 'text-zinc-400 hover:bg-zinc-700'
                    }`}
                    aria-label="Switch to setup view"
                    aria-pressed={activeView === 'setup'}
                >
                    Setup
                </button>
                <button
                    onClick={() => setActiveView('results')}
                    className={`w-1/2 rounded-lg py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeView === 'results' ? 'bg-amber-400 text-zinc-900 shadow-md' : 'text-zinc-400 hover:bg-zinc-700'
                    }`}
                    disabled={!computation && !isLoading}
                    aria-label="Switch to results view"
                    aria-pressed={activeView === 'results'}
                >
                    Results
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Column */}
          <div className={`flex-col gap-8 ${activeView === 'setup' ? 'flex' : 'hidden'} lg:flex`}>
            {challengeMode && (
              <ChallengeBanner
                challengerName={challengeMode.challengerName}
                targetCalories={challengeMode.targetCalories}
                currentCalories={currentTotalCalories}
                onDismiss={() => setChallengeMode(null)}
              />
            )}
            <FoodInputList
              foods={scenario.foods}
              onUpdateFood={updateFood}
              onRemoveFood={removeFood}
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={addFood}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors duration-200 text-amber-400 font-semibold transform hover:scale-[1.02]"
              >
                <PlusIcon />
                Manual
              </button>
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors duration-200 text-amber-400 font-semibold transform hover:scale-[1.02]"
              >
                <DatabaseIcon />
                Database
              </button>
              <button
                onClick={() => setIsCameraModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors duration-200 text-amber-400 font-semibold transform hover:scale-[1.02]"
              >
                <CameraIcon />
                With AI
              </button>
               <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors duration-200 text-amber-400 font-semibold transform hover:scale-[1.02]"
              >
                <HistoryIcon />
                History
              </button>
            </div>
            <GamificationDashboard profile={profile} onViewRewardsClick={() => setIsRewardsModalOpen(true)} />
            <UserInputCard
              user={scenario.user}
              preferences={scenario.preferences}
              activities={allActivities}
              onUserChange={(user) => setScenario({ ...scenario, user })}
              onPreferencesChange={(key, value) => setScenario(prev => ({ ...prev, preferences: { ...prev.preferences, [key]: value }}))}
              onCustomActivitiesChange={handleCustomActivitiesChange}
            />
            <OptionsCard
              options={scenario.options}
              onOptionChange={(key, value) => setScenario({ ...scenario, options: { ...scenario.options, [key]: value } })}
            />
            <div className="flex flex-col gap-4">
               <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-transparent border-2 border-zinc-600 rounded-xl hover:border-amber-400 hover:text-amber-400 transition-colors duration-200 text-zinc-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Reset all inputs"
                  title="Reset to default values"
                >
                  <ResetIcon className="w-5 h-5" />
                  Reset Inputs
                </button>
               <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-zinc-800 border-2 border-amber-400 text-amber-400 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/10 hover:bg-amber-400 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-zinc-800 disabled:text-amber-400/50 disabled:border-amber-400/50 transition-all duration-300 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ChartLineIcon className="w-6 h-6 text-amber-400 group-hover:text-zinc-900 transition-colors duration-300" />
                    Calculate Reality Check
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Column */}
          <div className={`${activeView === 'results' ? 'block' : 'hidden'} lg:block relative`}>
            <div className="lg:sticky lg:top-8">
              {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-4 animate-pulse">{error}</div>}
              {isLoading ? (
                 <LoadingAnalysis />
              ) : computation ? (
                <ResultsDisplay 
                    computation={computation} 
                    user={scenario.user}
                    onGamificationUpdate={handleGamificationUpdate}
                />
              ) : (
                <div className="w-full min-h-[500px] h-full bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 bg-amber-400 rounded-full blur-xl opacity-20"></div>
                    <ChartLineIcon className="relative w-16 h-16 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Metrics Await</h3>
                  <p className="text-zinc-400 mt-2 max-w-sm">Enter your food items, adjust the settings, and click "Calculate" to see the hidden equation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <section className="container mx-auto px-4">
        <SubscriptionCard />
      </section>
      <footer className="container mx-auto flex justify-center items-center py-6">
        <EnzarkLogo />
      </footer>
      <ShareAppButton />
      {isDbModalOpen && (
        <FoodDatabaseModal 
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
          onAddFood={addFoodFromDatabase}
        />
      )}
      {isGalleryModalOpen && (
        <ImageGalleryModal
            isOpen={isGalleryModalOpen}
            onClose={() => setIsGalleryModalOpen(false)}
            images={storedImages}
            onSelectImage={handleSelectImageFromGallery}
            onDeleteImage={handleDeleteImage}
        />
      )}
      {isCameraModalOpen && (
        <CameraAnalysisModal
          isOpen={isCameraModalOpen}
          onClose={() => {
            setIsCameraModalOpen(false);
            setReanalyzingImage(null);
          }}
          onAddFoods={addFoodsFromAnalysis}
          defaultEatMinutes={scenario.preferences.default_eat_minutes}
          onImageAnalyzed={handleImageAnalyzed}
          initialImage={reanalyzingImage}
        />
      )}
      {isRewardsModalOpen && (
        <RewardsModal
            isOpen={isRewardsModalOpen}
            onClose={() => setIsRewardsModalOpen(false)}
            userProfile={profile}
            onClaimReward={handleClaimReward}
        />
      )}
    </div>
  );
};

export default App;