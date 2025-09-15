
import React, { useState, useMemo, useEffect } from 'react';
import { FoodItem } from '../types';
import { FOOD_DATABASE } from '../constants';
import { PlusIcon, XIcon } from './Icons';

interface FoodDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

const FoodDatabaseModal: React.FC<FoodDatabaseModalProps> = ({ isOpen, onClose, onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = useMemo(() => {
    if (!searchTerm) return FOOD_DATABASE;
    return FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleAddAndClose = (food: FoodItem) => {
    onAddFood(food);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Food Database</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a food..."
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-3">
            {filteredFoods.map((food, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg transition-colors hover:bg-slate-700/80">
                <div>
                  <p className="font-semibold text-white">{food.name}</p>
                  <p className="text-sm text-slate-400">{food.serving_label} - {food.calories_kcal} kcal</p>
                </div>
                <button
                  onClick={() => handleAddAndClose(food)}
                  title={`Add ${food.name}`}
                  className="p-2 rounded-full text-emerald-300 bg-slate-700/50 hover:bg-slate-700 transition-all transform hover:scale-110"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
             {filteredFoods.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <p>No food items found for "{searchTerm}".</p>
                    <p className="text-sm">Try a different search term.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDatabaseModal;
