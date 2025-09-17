import React from 'react';
import { FoodItem } from '../types';
import { TrashIcon, CameraIcon } from './Icons';

interface FoodInputListProps {
  foods: FoodItem[];
  onUpdateFood: (index: number, food: FoodItem) => void;
  onRemoveFood: (index: number) => void;
  onOpenCameraForIndex: (index: number) => void;
}

const FoodInputCard: React.FC<{
  food: FoodItem;
  index: number;
  onUpdate: (food: FoodItem) => void;
  onRemove: () => void;
  onOpenCamera: () => void;
}> = ({ food, index, onUpdate, onRemove, onOpenCamera }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFood = { ...food };

    if (name === 'name' || name === 'serving_label') {
      newFood[name] = value;
    } else if (name === 'servings') {
      const newServings = value ? parseFloat(value) : 0;
      if (isNaN(newServings) || newServings < 0) return;
      newFood.servings = newServings;
      newFood.calories_kcal = Math.round(food.base_calories_kcal * newServings);
      newFood.eat_minutes = Math.round(food.base_eat_minutes * newServings);
    } else if (name === 'calories_kcal') {
      const newCalories = value ? parseInt(value, 10) : 0;
      if (isNaN(newCalories) || newCalories < 0) return;
      newFood.calories_kcal = newCalories;
      newFood.base_calories_kcal = food.servings > 0 ? newCalories / food.servings : newCalories;
    } else if (name === 'eat_minutes') {
      const newEatMinutes = value ? parseInt(value, 10) : 0;
      if (isNaN(newEatMinutes) || newEatMinutes < 0) return;
      newFood.eat_minutes = newEatMinutes;
      newFood.base_eat_minutes = food.servings > 0 ? newEatMinutes / food.servings : newEatMinutes;
    }
    
    onUpdate(newFood);
  };

  return (
    <div
      className={`bg-zinc-900 p-4 rounded-xl border border-zinc-800 border-t-amber-500/20 relative animate-pop-in transition-all duration-200 hover:scale-[1.02] hover:border-zinc-700 food-input-card-${index}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="grid grid-cols-6 gap-x-4 gap-y-3">
        <div className="col-span-6">
          <label htmlFor={`name-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
          <div className="relative">
            <input
              type="text"
              id={`name-${index}`}
              name="name"
              value={food.name}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-3 pr-10 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              placeholder="Cookie or use AI camera ->"
            />
            <button
              type="button"
              onClick={onOpenCamera}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-amber-400 transition-colors"
              aria-label="Analyze food with camera"
              title="Analyze with AI Camera"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="col-span-6">
          <label htmlFor={`serving_label-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Serving</label>
          <input
            type="text"
            id={`serving_label-${index}`}
            name="serving_label"
            value={food.serving_label}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="1 cookie"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor={`servings-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Servings</label>
          <input
            type="number"
            id={`servings-${index}`}
            name="servings"
            value={food.servings}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="1"
            min="0"
            step="0.1"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor={`calories_kcal-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Calories</label>
          <input
            type="number"
            id={`calories_kcal-${index}`}
            name="calories_kcal"
            value={food.calories_kcal}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="200"
            min="0"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor={`eat_minutes-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Eat Mins</label>
          <input
            type="number"
            id={`eat_minutes-${index}`}
            name="eat_minutes"
            value={food.eat_minutes}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="2"
            min="1"
          />
        </div>
      </div>
       <button onClick={onRemove} className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition-all transform hover:scale-110">
        <TrashIcon />
      </button>
    </div>
  );
};


const FoodInputList: React.FC<FoodInputListProps> = ({ foods, onUpdateFood, onRemoveFood, onOpenCameraForIndex }) => {
  return (
    <div className="space-y-4">
      {foods.map((food, index) => (
        <FoodInputCard
          key={index}
          food={food}
          index={index}
          onUpdate={(updatedFood) => onUpdateFood(index, updatedFood)}
          onRemove={() => onRemoveFood(index)}
          onOpenCamera={() => onOpenCameraForIndex(index)}
        />
      ))}
    </div>
  );
};

export default FoodInputList;