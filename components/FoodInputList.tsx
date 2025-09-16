import React from 'react';
import { FoodItem } from '../types';
import { TrashIcon } from './Icons';

interface FoodInputListProps {
  foods: FoodItem[];
  onUpdateFood: (index: number, food: FoodItem) => void;
  onRemoveFood: (index: number) => void;
}

const FoodInputCard: React.FC<{
  food: FoodItem;
  index: number;
  onUpdate: (food: FoodItem) => void;
  onRemove: () => void;
}> = ({ food, index, onUpdate, onRemove }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...food,
      [name]: name === 'calories_kcal' || name === 'eat_minutes' ? (value ? parseInt(value, 10) : 0) : value,
    });
  };

  return (
    <div
      className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 border-t-amber-500/20 relative animate-pop-in transition-all duration-200 hover:scale-[1.02] hover:border-zinc-700"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <label htmlFor={`name-${index}`} className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
          <input
            type="text"
            id={`name-${index}`}
            name="name"
            value={food.name}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="Cookie"
          />
        </div>
        <div>
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
        <div>
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
        <div>
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


const FoodInputList: React.FC<FoodInputListProps> = ({ foods, onUpdateFood, onRemoveFood }) => {
  return (
    <div className="space-y-4">
      {foods.map((food, index) => (
        <FoodInputCard
          key={index}
          food={food}
          index={index}
          onUpdate={(updatedFood) => onUpdateFood(index, updatedFood)}
          onRemove={() => onRemoveFood(index)}
        />
      ))}
    </div>
  );
};

export default FoodInputList;