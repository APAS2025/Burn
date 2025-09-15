
import React, { useState, useCallback } from 'react';
import { Scenario, FoodItem, Computation } from './types';
import { DEFAULT_SCENARIO, ACTIVITY_LIBRARY } from './constants';
import { getCalorieAnalysis } from './services/geminiService';
import FoodInputList from './components/FoodInputList';
import UserInputCard from './components/UserInputCard';
import OptionsCard from './components/OptionsCard';
import ResultsDisplay from './components/ResultsDisplay';
import { PlusIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [computation, setComputation] = useState<Computation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-900 font-sans text-gray-200">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Eat in Minutes, Burn in Hours
          </h1>
          <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Visualize the real cost of calories. See how a few minutes of eating translate into hours of exercise.
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
            <button
              onClick={addFood}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200 text-cyan-400 font-semibold"
            >
              <PlusIcon />
              Add Food Item
            </button>
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
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-4">{error}</div>}
              {isLoading ? (
                 <div className="w-full h-96 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm border border-white/10">
                   <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h3 className="text-xl font-semibold text-white">Crunching the numbers...</h3>
                  <p className="text-slate-400">This can take a moment.</p>
                 </div>
              ) : computation ? (
                <ResultsDisplay computation={computation} />
              ) : (
                <div className="w-full h-96 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm border border-white/10 p-8 text-center">
                  <SparklesIcon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white">Your Calorie Reality Check Awaits</h3>
                  <p className="text-slate-400 mt-2">Fill in your food items, personalize the settings, and hit the calculate button to see your results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;