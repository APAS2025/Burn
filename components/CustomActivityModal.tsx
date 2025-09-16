import React, { useState, useEffect } from 'react';
import { CustomActivity } from '../types';
import { XIcon, PencilIcon, TrashIcon, PlusIcon } from './Icons';

interface CustomActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: CustomActivity[];
  onSave: (updatedActivities: CustomActivity[]) => void;
}

const emptyActivity: Omit<CustomActivity, 'key'> = {
  label: '',
  met: 3.5,
  speed_mph: null
};

const CustomActivityModal: React.FC<CustomActivityModalProps> = ({ isOpen, onClose, activities, onSave }) => {
  const [formState, setFormState] = useState(emptyActivity);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormState(emptyActivity);
      setEditingKey(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | null = value;
    if (name === 'met' || name === 'speed_mph') {
        processedValue = value ? parseFloat(value) : null;
        if (processedValue !== null && isNaN(processedValue)) return;
    }
    setFormState(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSave = () => {
    if (!formState.label || (formState.met !== null && formState.met <= 0)) {
        alert("Please provide a valid name and a positive MET value.");
        return;
    }

    let updatedActivities;
    if (editingKey) {
        // Update existing
        updatedActivities = activities.map(act => 
            act.key === editingKey ? { ...act, ...formState } : act
        );
    } else {
        // Add new
        const newActivity: CustomActivity = {
            ...formState,
            key: `custom-${Date.now()}`
        };
        updatedActivities = [...activities, newActivity];
    }
    
    onSave(updatedActivities);
    setFormState(emptyActivity);
    setEditingKey(null);
  };
  
  const handleEdit = (activity: CustomActivity) => {
    setEditingKey(activity.key);
    setFormState({
        label: activity.label,
        met: activity.met,
        speed_mph: activity.speed_mph
    });
  };

  const handleDelete = (key: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
        const updatedActivities = activities.filter(act => act.key !== key);
        onSave(updatedActivities);
    }
  };

  const handleCancelEdit = () => {
    setFormState(emptyActivity);
    setEditingKey(null);
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
        className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-amber-400">Manage Custom Activities</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activities.length > 0 ? (
                activities.map(act => (
                    <div key={act.key} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg">
                        <div>
                            <p className="font-semibold text-white">{act.label}</p>
                            <p className="text-sm text-zinc-400">MET: {act.met} {act.speed_mph && `| Speed: ${act.speed_mph} mph`}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => handleEdit(act)} className="p-2 text-zinc-400 hover:text-amber-400 transition-colors"><PencilIcon className="w-5 h-5"/></button>
                             <button onClick={() => handleDelete(act.key)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-zinc-400 py-4">You haven't added any custom activities yet.</p>
            )}
        </div>

        <footer className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <h3 className="text-lg font-semibold text-white mb-4">{editingKey ? 'Edit Activity' : 'Add New Activity'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Activity Name</label>
                    <input type="text" name="label" value={formState.label} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="e.g., My HIIT Workout" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1 relative group">
                        MET Value
                        <span className="absolute bottom-full left-0 mb-2 w-64 bg-zinc-800 text-zinc-300 text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-700 shadow-lg">
                            MET (Metabolic Equivalent of Task) is a measure of exercise intensity. Walking at 3 mph is ~3.5 METs.
                        </span>
                    </label>
                    <input type="number" name="met" value={formState.met || ''} onChange={handleInputChange} step="0.1" min="0" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="e.g., 8.0" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Speed (mph, optional)</label>
                    <input type="number" name="speed_mph" value={formState.speed_mph || ''} onChange={handleInputChange} step="0.1" min="0" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-amber-400" placeholder="e.g., 6.0" />
                </div>
            </div>
            <div className="mt-4 flex gap-4">
                {editingKey && (
                     <button onClick={handleCancelEdit} className="flex-1 py-2 px-4 bg-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-colors">Cancel</button>
                )}
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:bg-amber-300 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    {editingKey ? 'Save Changes' : 'Add Activity'}
                </button>
            </div>
        </footer>

      </div>
    </div>
  );
};

export default CustomActivityModal;