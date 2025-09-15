
import { Scenario, ActivityLibrary } from './types';

export const ACTIVITY_LIBRARY: ActivityLibrary = {
  walking_2_mph: { label: 'Walk, easy', speed_mph: 2.0, met: 2.8 },
  walking_3_mph: { label: 'Walk, moderate', speed_mph: 3.0, met: 3.5 },
  walking_4_mph: { label: 'Walk, brisk', speed_mph: 4.0, met: 5.0 },
  jogging_5_mph: { label: 'Jog', speed_mph: 5.0, met: 8.0 },
  running_6_mph: { label: 'Run', speed_mph: 6.0, met: 9.8 },
  cycling_10_12_mph: { label: 'Bike, easy', speed_mph: 11.0, met: 6.0 },
  cycling_14_16_mph: { label: 'Bike, hard', speed_mph: 15.0, met: 10.0 },
  swimming_easy: { label: 'Swim, easy', speed_mph: null, met: 6.0 },
  swimming_hard: { label: 'Swim, hard', speed_mph: null, met: 10.0 },
};

export const DEFAULT_SCENARIO: Scenario = {
  user: {
    weight_kg: 75,
    height_cm: null,
    sex: null,
    age: null
  },
  preferences: {
    default_eat_minutes: 5,
    activity: "walking_3_mph", 
    pace_override: null,
    steps_per_mile: 2000
  },
  options: {
    include_personalization: true,
    include_shock_factor: true,
    include_education: true,
    include_visual_hints: true,
    servings_multiplier: 3,
    days_per_year: 365
  },
  foods: [
    {
      name: "Chocolate chip cookie",
      serving_label: "1 cookie (40g)",
      calories_kcal: 200,
      eat_minutes: 2
    },
    {
      name: "Potato chips",
      serving_label: "1 serving (28g)",
      calories_kcal: 160,
      eat_minutes: 3
    },
    {
      name: "Soda",
      serving_label: "12 oz can",
      calories_kcal: 150,
      eat_minutes: 2
    }
  ]
};
