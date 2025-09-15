
import React, { useState, useCallback } from 'react';
import { Scenario, FoodItem, Computation } from './types';
import { DEFAULT_SCENARIO, ACTIVITY_LIBRARY } from './constants';
import { getCalorieAnalysis } from './services/geminiService';
import FoodInputList from './components/FoodInputList';
import UserInputCard from './components/UserInputCard';
import OptionsCard from './components/OptionsCard';
import ResultsDisplay from './components/ResultsDisplay';
import FoodDatabaseModal from './components/FoodDatabaseModal';
import { PlusIcon, SparklesIcon, DatabaseIcon } from './components/Icons';
import LoadingAnalysis from './components/LoadingAnalysis';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [computation, setComputation] = useState<Computation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-500">
            Eat in Minutes, Burn in Hours
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Gamify your diet. Discover the surprising amount of exercise needed to burn off your favorite foods.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={addFood}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/40 border border-slate-700/80 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 text-emerald-400 font-semibold transform hover:scale-[1.02]"
              >
                <PlusIcon />
                Add Manually
              </button>
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/40 border border-slate-700/80 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 text-emerald-400 font-semibold transform hover:scale-[1.02]"
              >
                <DatabaseIcon />
                Add from Database
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
             <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Calculate Reality Check
                </>
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="relative">
            <div className="sticky top-8">
              {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-2xl mb-4 animate-pulse">{error}</div>}
              {isLoading ? (
                 <LoadingAnalysis />
              ) : computation ? (
                <ResultsDisplay computation={computation} />
              ) : (
                <div className="w-full min-h-[500px] h-full bg-slate-800/40 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center border border-slate-700 p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-30"></div>
                    <SparklesIcon className="relative w-16 h-16 text-emerald-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Calorie Reality Check Awaits</h3>
                  <p className="text-slate-300 mt-2 max-w-sm">Fill in your food items, personalize the settings, and hit the calculate button to see your results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {isDbModalOpen && (
        <FoodDatabaseModal 
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
          onAddFood={addFoodFromDatabase}
        />
      )}
    </div>
  );
};

export default App;
