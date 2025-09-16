

import React, { useState, useCallback, useEffect } from 'react';
import { Scenario, FoodItem, Computation } from './types';
import { DEFAULT_SCENARIO, ACTIVITY_LIBRARY } from './constants';
import { getCalorieAnalysis } from './services/geminiService';
import FoodInputList from './components/FoodInputList';
import UserInputCard from './components/UserInputCard';
import OptionsCard from './components/OptionsCard';
import ResultsDisplay from './components/ResultsDisplay';
import FoodDatabaseModal from './components/FoodDatabaseModal';
import CameraAnalysisModal from './components/CameraAnalysisModal';
import { PlusIcon, SparklesIcon, DatabaseIcon, CameraIcon, ChartLineIcon, ResetIcon } from './components/Icons';
import LoadingAnalysis from './components/LoadingAnalysis';
import EnzarkLogo from './components/EnzarkLogo';
import ShareAppButton from './components/ShareAppButton';


const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [computation, setComputation] = useState<Computation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeData = urlParams.get('challenge');

    if (challengeData) {
        try {
            const decodedString = atob(challengeData);
            const foodsFromChallenge: FoodItem[] = JSON.parse(decodedString);

            if (Array.isArray(foodsFromChallenge) && foodsFromChallenge.length > 0) {
                setScenario(prevScenario => ({
                    ...prevScenario,
                    foods: foodsFromChallenge,
                }));
            }
        } catch (e) {
            console.error("Failed to parse challenge data from URL", e);
        } finally {
            // Clean the URL to avoid re-processing or re-sharing the same challenge
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
  }, []); // Run once on mount to check for incoming challenges

  const updateFood = (index: number, updatedFood: FoodItem) => {
    const newFoods = [...scenario.foods];
    newFoods[index] = updatedFood;
    setScenario({ ...scenario, foods: newFoods });
  };

  const addFood = () => {
    const newFood: FoodItem = {
      name: 'New Food Item',
      serving_label: '1 serving',
      calories_kcal: 100,
      eat_minutes: scenario.preferences.default_eat_minutes,
    };
    setScenario({ ...scenario, foods: [...scenario.foods, newFood] });
  };
  
  const addFoodFromDatabase = (food: FoodItem) => {
    setScenario({ ...scenario, foods: [...scenario.foods, food] });
  };

  const addFoodsFromAnalysis = (newFoods: FoodItem[]) => {
    setScenario(prev => ({ ...prev, foods: [...prev.foods, ...newFoods] }));
  };

  const removeFood = (index: number) => {
    const newFoods = scenario.foods.filter((_, i) => i !== index);
    setScenario({ ...scenario, foods: newFoods });
  };
  
  const handleCalculate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setComputation(null);
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
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [scenario]);

  const handleReset = useCallback(() => {
    setScenario(DEFAULT_SCENARIO);
    setComputation(null);
    setError(null);
  }, []);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Column */}
          <div className="flex flex-col gap-8">
            <FoodInputList
              foods={scenario.foods}
              onUpdateFood={updateFood}
              onRemoveFood={removeFood}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            <UserInputCard
              user={scenario.user}
              activity={scenario.preferences.activity}
              activities={Object.entries(ACTIVITY_LIBRARY).map(([key, value]) => ({ key, label: value.label }))}
              onUserChange={(user) => setScenario({ ...scenario, user })}
              onActivityChange={(activity) => setScenario({ ...scenario, preferences: { ...scenario.preferences, activity } })}
            />
            <OptionsCard
              options={scenario.options}
              onOptionChange={(key, value) => setScenario({ ...scenario, options: { ...scenario.options, [key]: value } })}
            />
            <div className="flex items-stretch gap-4">
               <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="flex-shrink-0 flex items-center justify-center p-4 bg-zinc-800 border-2 border-zinc-700 text-zinc-400 rounded-xl hover:border-zinc-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  aria-label="Reset all inputs"
                  title="Reset to default values"
                >
                  <ResetIcon className="w-6 h-6" />
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
          <div className="relative">
            <div className="sticky top-8">
              {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-4 animate-pulse">{error}</div>}
              {isLoading ? (
                 <LoadingAnalysis />
              ) : computation ? (
                <ResultsDisplay computation={computation} />
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
      {isCameraModalOpen && (
        <CameraAnalysisModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          onAddFoods={addFoodsFromAnalysis}
          defaultEatMinutes={scenario.preferences.default_eat_minutes}
        />
      )}
    </div>
  );
};

export default App;