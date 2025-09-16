

export interface User {
  weight_kg: number | null;
  height_cm: number | null;
  sex: string | null;
  age: number | null;
}

export interface CustomActivity {
  key: string;
  label: string;
  met: number;
  speed_mph: number | null;
}

export interface Preferences {
  default_eat_minutes: number;
  activity: string;
  pace_override: number | null;
  steps_per_mile: number;
  weight_unit: 'kg' | 'lbs';
  custom_activities: CustomActivity[];
}

export interface Options {
  include_personalization: boolean;
  include_shock_factor: boolean;
  include_education: boolean;
  include_visual_hints: boolean;
  servings_multiplier: number;
  days_per_year: number;
}

export interface FoodItem {
  name: string;
  serving_label: string;
  calories_kcal: number; // This is the TOTAL calories for the given servings
  eat_minutes: number;   // This is the TOTAL eat minutes for the given servings
  servings: number;
  base_calories_kcal: number; // Calories for 1 serving
  base_eat_minutes: number;   // Eat minutes for 1 serving
}

export interface Scenario {
  user: User;
  preferences: Preferences;
  options: Options;
  foods: FoodItem[];
}

export interface ShockFactor {
  servings_multiplier: number;
  calories_kcal: number;
  burn_minutes: number;
  burn_steps: number;
}

export interface Annualized {
  days_per_year: number;
  calories_kcal: number;
  pounds_equiv: number;
}

export interface Education {
  satiety_flag: string;
  suggested_swap: string;
}

export interface ContextualAnchors {
  time_equivalent: string;
  steps_equivalent_of_daily_goal: string;
}

export interface ComputationItem {
  name: string;
  serving_label: string;
  calories_kcal: number;
  eat_minutes: number;
  burn_minutes: number;
  burn_steps: number;
  minutes_to_eat_vs_burn_ratio: number;
  shock_factor: ShockFactor;
  annualized: Annualized;
  education: Education;
  contextual_anchors: ContextualAnchors;
  shareable_card_text: string;
}

export interface ComputationTotals {
  foods_count: number;
  calories_kcal: number;
  eat_minutes: number;
  burn_minutes: number;
  burn_steps: number;
  annualized: Annualized;
  shareable_card_text: string;
}

export interface ComputationReport {
  title: string;
  summary: string;
  details_markdown: string;
  education_summary?: string;
}

export interface ActivityProfile {
    activity_key: string;
    met: number;
    speed_mph: number | null;
}

export interface MetaDefaults {
    weight_kg: number;
    steps_per_mile: number;
    calories_per_pound: number;
}

export interface ComputationMeta {
    version: string;
    defaults: MetaDefaults;
    activity_profile: ActivityProfile;
}

export interface Computation {
  meta: ComputationMeta;
  items: ComputationItem[];
  totals: ComputationTotals;
  report: ComputationReport;
  options: Options;
  warnings?: string[];
}

export interface Activity {
    label: string;
    speed_mph: number | null;
    met: number;
}

export interface ActivityLibrary {
    [key: string]: Activity;
}