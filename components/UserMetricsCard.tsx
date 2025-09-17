import React, { useMemo } from 'react';
import { User } from '../types';
import { ScaleIcon, ArrowsUpDownIcon, UserCircleIcon } from './Icons';

interface UserMetricsCardProps {
    user: User;
}

const MetricDisplay: React.FC<{ icon: React.ReactNode, value: string, label: string, valueClassName?: string }> = ({ icon, value, label, valueClassName = "text-white" }) => (
    <div className="bg-zinc-900/70 p-3 rounded-xl text-center">
        <div className="w-8 h-8 mx-auto flex items-center justify-center mb-1">
            {icon}
        </div>
        <p className={`text-xl font-bold truncate ${valueClassName}`}>{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
    </div>
);


const UserMetricsCard: React.FC<UserMetricsCardProps> = ({ user }) => {

    const bmiData = useMemo(() => {
        if (user.weight_kg && user.height_cm && user.weight_kg > 0 && user.height_cm > 0) {
          const heightInMeters = user.height_cm / 100;
          const bmi = user.weight_kg / (heightInMeters * heightInMeters);
          let category = '';
          let colorClass = '';
    
          if (bmi < 18.5) {
            category = 'Underweight';
            colorClass = 'text-blue-300';
          } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal';
            colorClass = 'text-green-300';
          } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            colorClass = 'text-amber-300';
          } else {
            category = 'Obesity';
            colorClass = 'text-red-300';
          }
          return { value: bmi.toFixed(1), category, colorClass };
        }
        return null;
    }, [user.weight_kg, user.height_cm]);

    return (
        <section className="py-6 border-t border-zinc-800">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Your Profile Snapshot</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricDisplay
                    icon={<ScaleIcon className="w-6 h-6 text-zinc-400" />}
                    value={user.weight_kg ? `${Math.round(user.weight_kg)} kg` : '--'}
                    label="Weight"
                />
                <MetricDisplay
                    icon={<ArrowsUpDownIcon className="w-6 h-6 text-zinc-400" />}
                    value={user.height_cm ? `${user.height_cm} cm` : '--'}
                    label="Height"
                />
                 {bmiData ? (
                    <MetricDisplay
                        icon={<ScaleIcon className="w-6 h-6 text-zinc-400" />}
                        value={bmiData.value}
                        label={bmiData.category}
                        valueClassName={bmiData.colorClass}
                    />
                 ) : (
                    <MetricDisplay
                        icon={<ScaleIcon className="w-6 h-6 text-zinc-500" />}
                        value="--"
                        label="BMI"
                        valueClassName="text-zinc-500"
                    />
                 )}
                <MetricDisplay
                    icon={<UserCircleIcon className="w-6 h-6 text-zinc-400" />}
                    value={user.age ? `${user.age}` : '--'}
                    label="Age"
                />
            </div>
        </section>
    );
};

export default UserMetricsCard;