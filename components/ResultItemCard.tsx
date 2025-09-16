import React, { useState } from 'react';
import { ComputationItem, FoodItem, SwapItem } from '../types';
import { HeartIcon, XIcon, PlusIcon, DatabaseIcon, CameraIcon, CutleryIcon, FlameIcon } from './Icons';

interface ResultItemCardProps {
  item: ComputationItem;
  swappedItem: SwapItem | null;
  onAddSwap: (food: FoodItem) => void;
  onRemoveSwap: () => void;
  onRequestSwapFromDB: () => void;
  onRequestSwapFromCamera: () => void;
}

const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

const StatDisplay: React.FC<{ icon: React.ReactNode, value: string, label: string, valueClassName?: string }> = ({ icon, value, label, valueClassName = "text-white" }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-zinc-700/50 rounded-full">{icon}</div>
        <div>
            <p className={`font-bold text-lg ${valueClassName}`}>{value}</p>
            <p className="text-xs text-zinc-400">{label}</p>
        </div>
    </div>
);

const ResultItemCard: React.FC<ResultItemCardProps> = ({ item, swappedItem, onAddSwap, onRemoveSwap, onRequestSwapFromDB, onRequestSwapFromCamera }) => {
    const [isSwapUIOpen, setIsSwapUIOpen] = useState(false);
    const [manualSwap, setManualSwap] = useState({ name: '', calories_kcal: '' });

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualSwap({ ...manualSwap, [e.target.name]: e.target.value });
    };

    const handleAddManualSwap = (e: React.FormEvent) => {
        e.preventDefault();
        const calories = parseInt(manualSwap.calories_kcal, 10);
        if (manualSwap.name && !isNaN(calories) && calories > 0) {
            const foodItem: FoodItem = {
                name: manualSwap.name,
                serving_label: '1 serving',
                calories_kcal: calories,
                eat_minutes: 5, // A reasonable default
                servings: 1,
                base_calories_kcal: calories,
                base_eat_minutes: 5,
            };
            onAddSwap(foodItem);
            setIsSwapUIOpen(false);
            setManualSwap({ name: '', calories_kcal: '' });
        }
    };

    const calorie_diff = swappedItem ? item.calories_kcal - swappedItem.calories_kcal : 0;
    const burn_diff = swappedItem ? item.burn_minutes - swappedItem.burn_minutes : 0;

    return (
        <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-800/50 transition-all duration-300">
            {swappedItem ? (
                // --- COMPARISON VIEW ---
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-amber-400 font-semibold">COMPARISON</p>
                            <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                            <p className="text-lg text-zinc-400">vs. {swappedItem.name}</p>
                        </div>
                        <button onClick={onRemoveSwap} className="p-1 text-zinc-500 hover:text-white transition-colors" title="Remove Swap">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <h4 className="font-bold text-green-300">Your Healthy Swap Saved You:</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-center">
                            <div className="bg-zinc-800/50 p-3 rounded-lg">
                                <p className="text-2xl font-extrabold text-white">{calorie_diff > 0 ? `-${calorie_diff.toLocaleString()}` : `+${Math.abs(calorie_diff).toLocaleString()}`}</p>
                                <p className="text-sm text-zinc-400">Calories</p>
                            </div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg">
                                <p className="text-2xl font-extrabold text-white">{burn_diff > 0 ? `-${formatMinutes(burn_diff)}` : `+${formatMinutes(Math.abs(burn_diff))}`}</p>
                                <p className="text-sm text-zinc-400">Burn Time</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- NORMAL VIEW ---
                <div>
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-zinc-400">{item.serving_label}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <StatDisplay icon={<CutleryIcon className="w-5 h-5 text-amber-400" />} value={formatMinutes(item.eat_minutes)} label="Time to Eat" valueClassName="text-amber-400" />
                        <StatDisplay icon={<FlameIcon className="w-5 h-5 text-red-400" />} value={formatMinutes(item.burn_minutes)} label="Time to Burn" valueClassName="text-red-400" />
                    </div>
                    <div className="mt-4 border-t border-zinc-700/80 pt-4">
                        <button
                            onClick={() => setIsSwapUIOpen(!isSwapUIOpen)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-700/50 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors text-amber-400 font-semibold"
                            aria-expanded={isSwapUIOpen}
                        >
                            <HeartIcon />
                            Healthy Swap
                        </button>
                    </div>
                </div>
            )}
            
            {/* --- SWAP INPUT UI (collapsible) --- */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSwapUIOpen ? 'max-h-96 mt-4 pt-4 border-t border-zinc-700/80' : 'max-h-0'}`}>
                <h4 className="text-lg font-semibold text-white mb-3">Add a healthier choice</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button onClick={onRequestSwapFromDB} className="flex items-center justify-center gap-2 py-2 px-3 bg-zinc-700/80 rounded-lg hover:bg-zinc-700 transition-colors text-sm"><DatabaseIcon className="w-4 h-4" />Database</button>
                    <button onClick={onRequestSwapFromCamera} className="flex items-center justify-center gap-2 py-2 px-3 bg-zinc-700/80 rounded-lg hover:bg-zinc-700 transition-colors text-sm"><CameraIcon className="w-4 h-4" />With AI</button>
                </div>
                <form onSubmit={handleAddManualSwap} className="space-y-3">
                     <input
                        type="text"
                        name="name"
                        value={manualSwap.name}
                        onChange={handleManualChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400"
                        placeholder="Healthier item name"
                        required
                    />
                    <input
                        type="number"
                        name="calories_kcal"
                        value={manualSwap.calories_kcal}
                        onChange={handleManualChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400"
                        placeholder="Calories (kcal)"
                        min="0"
                        required
                    />
                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-amber-400 text-zinc-900 font-bold rounded-lg hover:bg-amber-300 transition-colors">
                        <PlusIcon />
                        Add & Compare
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResultItemCard;