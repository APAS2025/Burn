

import { Scenario, ActivityLibrary, FoodItem } from './types';

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

export const getDefaultScenario = (): Scenario => ({
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
    steps_per_mile: 2000,
    weight_unit: 'kg'
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
      eat_minutes: 2,
      servings: 1,
      base_calories_kcal: 200,
      base_eat_minutes: 2,
    },
    {
      name: "Potato chips",
      serving_label: "1 serving (28g)",
      calories_kcal: 160,
      eat_minutes: 3,
      servings: 1,
      base_calories_kcal: 160,
      base_eat_minutes: 3,
    },
    {
      name: "Soda",
      serving_label: "12 oz can",
      calories_kcal: 150,
      eat_minutes: 2,
      servings: 1,
      base_calories_kcal: 150,
      base_eat_minutes: 2,
    }
  ]
});

export const FOOD_DATABASE: FoodItem[] = [
  // Drinks
  { name: "Coca-Cola", serving_label: "1 can (12 oz)", calories_kcal: 140, eat_minutes: 2, servings: 1, base_calories_kcal: 140, base_eat_minutes: 2 },
  { name: "Starbucks Frappuccino", serving_label: "1 bottle (13.7 oz)", calories_kcal: 290, eat_minutes: 5, servings: 1, base_calories_kcal: 290, base_eat_minutes: 5 },
  { name: "Orange Juice", serving_label: "1 cup (8 oz)", calories_kcal: 110, eat_minutes: 2, servings: 1, base_calories_kcal: 110, base_eat_minutes: 2 },
  { name: "Milk, 2%", serving_label: "1 cup (8 oz)", calories_kcal: 120, eat_minutes: 2, servings: 1, base_calories_kcal: 120, base_eat_minutes: 2 },
  { name: "Red Bull", serving_label: "1 can (8.4 oz)", calories_kcal: 110, eat_minutes: 3, servings: 1, base_calories_kcal: 110, base_eat_minutes: 3 },
  // Fast Food
  { name: "McDonald's Big Mac", serving_label: "1 burger", calories_kcal: 563, eat_minutes: 7, servings: 1, base_calories_kcal: 563, base_eat_minutes: 7 },
  { name: "McDonald's Fries", serving_label: "Medium", calories_kcal: 320, eat_minutes: 6, servings: 1, base_calories_kcal: 320, base_eat_minutes: 6 },
  { name: "Pizza Slice (Pepperoni)", serving_label: "1 slice", calories_kcal: 285, eat_minutes: 4, servings: 1, base_calories_kcal: 285, base_eat_minutes: 4 },
  { name: "Taco Bell Crunchy Taco", serving_label: "1 taco", calories_kcal: 170, eat_minutes: 2, servings: 1, base_calories_kcal: 170, base_eat_minutes: 2 },
  { name: "Subway 6\" Turkey Breast", serving_label: "1 sub", calories_kcal: 280, eat_minutes: 8, servings: 1, base_calories_kcal: 280, base_eat_minutes: 8 },
  { name: "KFC Original Recipe Drumstick", serving_label: "1 piece", calories_kcal: 120, eat_minutes: 3, servings: 1, base_calories_kcal: 120, base_eat_minutes: 3 },
  // Snacks
  { name: "Doritos (Nacho Cheese)", serving_label: "1 oz (about 11 chips)", calories_kcal: 150, eat_minutes: 3, servings: 1, base_calories_kcal: 150, base_eat_minutes: 3 },
  { name: "Pringles (Original)", serving_label: "1 oz (about 15 chips)", calories_kcal: 150, eat_minutes: 4, servings: 1, base_calories_kcal: 150, base_eat_minutes: 4 },
  { name: "Oreo Cookies", serving_label: "3 cookies", calories_kcal: 160, eat_minutes: 2, servings: 1, base_calories_kcal: 160, base_eat_minutes: 2 },
  { name: "Snickers Bar", serving_label: "1 bar (1.86 oz)", calories_kcal: 250, eat_minutes: 3, servings: 1, base_calories_kcal: 250, base_eat_minutes: 3 },
  { name: "Reese's Peanut Butter Cups", serving_label: "2 cups", calories_kcal: 210, eat_minutes: 2, servings: 1, base_calories_kcal: 210, base_eat_minutes: 2 },
  { name: "Pop-Tarts (Frosted Strawberry)", serving_label: "1 pastry", calories_kcal: 200, eat_minutes: 2, servings: 1, base_calories_kcal: 200, base_eat_minutes: 2 },
  { name: "Cheetos (Crunchy)", serving_label: "1 oz (about 21 pieces)", calories_kcal: 160, eat_minutes: 4, servings: 1, base_calories_kcal: 160, base_eat_minutes: 4 },
  { name: "Ice Cream (Vanilla)", serving_label: "1/2 cup", calories_kcal: 137, eat_minutes: 5, servings: 1, base_calories_kcal: 137, base_eat_minutes: 5 },
  { name: "Popcorn (Buttered)", serving_label: "1 cup", calories_kcal: 192, eat_minutes: 6, servings: 1, base_calories_kcal: 192, base_eat_minutes: 6 },
  // Healthier Options / Fruits
  { name: "Apple", serving_label: "1 medium", calories_kcal: 95, eat_minutes: 5, servings: 1, base_calories_kcal: 95, base_eat_minutes: 5 },
  { name: "Banana", serving_label: "1 medium", calories_kcal: 105, eat_minutes: 3, servings: 1, base_calories_kcal: 105, base_eat_minutes: 3 },
  { name: "Baby Carrots", serving_label: "1 cup", calories_kcal: 50, eat_minutes: 7, servings: 1, base_calories_kcal: 50, base_eat_minutes: 7 },
  { name: "Almonds", serving_label: "1/4 cup", calories_kcal: 160, eat_minutes: 6, servings: 1, base_calories_kcal: 160, base_eat_minutes: 6 },
  { name: "Greek Yogurt (Plain)", serving_label: "1 container (7 oz)", calories_kcal: 100, eat_minutes: 4, servings: 1, base_calories_kcal: 100, base_eat_minutes: 4 },
  { name: "Avocado", serving_label: "1/2 medium", calories_kcal: 160, eat_minutes: 5, servings: 1, base_calories_kcal: 160, base_eat_minutes: 5 },
  { name: "Hard Boiled Egg", serving_label: "1 large", calories_kcal: 78, eat_minutes: 2, servings: 1, base_calories_kcal: 78, base_eat_minutes: 2 },
  // Breakfast
  { name: "Cheerios", serving_label: "1 cup (cereal only)", calories_kcal: 100, eat_minutes: 5, servings: 1, base_calories_kcal: 100, base_eat_minutes: 5 },
  { name: "Donut (Glazed)", serving_label: "1 medium", calories_kcal: 260, eat_minutes: 2, servings: 1, base_calories_kcal: 260, base_eat_minutes: 2 },
  { name: "Bagel with Cream Cheese", serving_label: "1 medium", calories_kcal: 350, eat_minutes: 6, servings: 1, base_calories_kcal: 350, base_eat_minutes: 6 },
  { name: "Pancakes with Syrup", serving_label: "2 medium + 2 tbsp syrup", calories_kcal: 450, eat_minutes: 8, servings: 1, base_calories_kcal: 450, base_eat_minutes: 8 },
  // Common Meals
  { name: "Spaghetti with Marinara", serving_label: "1 cup", calories_kcal: 220, eat_minutes: 10, servings: 1, base_calories_kcal: 220, base_eat_minutes: 10 },
  { name: "Chicken Breast (Grilled)", serving_label: "3 oz", calories_kcal: 165, eat_minutes: 8, servings: 1, base_calories_kcal: 165, base_eat_minutes: 8 },
  { name: "Salmon (Baked)", serving_label: "3 oz", calories_kcal: 180, eat_minutes: 9, servings: 1, base_calories_kcal: 180, base_eat_minutes: 9 },
  { name: "White Rice", serving_label: "1 cup cooked", calories_kcal: 205, eat_minutes: 7, servings: 1, base_calories_kcal: 205, base_eat_minutes: 7 },
  { name: "Caesar Salad with Chicken", serving_label: "1 serving", calories_kcal: 470, eat_minutes: 12, servings: 1, base_calories_kcal: 470, base_eat_minutes: 12 },
  // More Snacks
  { name: "Hershey's Milk Chocolate Bar", serving_label: "1 bar (1.55 oz)", calories_kcal: 210, eat_minutes: 3, servings: 1, base_calories_kcal: 210, base_eat_minutes: 3 },
  { name: "M&M's (Peanut)", serving_label: "1 fun size bag", calories_kcal: 90, eat_minutes: 2, servings: 1, base_calories_kcal: 90, base_eat_minutes: 2 },
  { name: "Pretzels (Hard)", serving_label: "1 oz", calories_kcal: 110, eat_minutes: 4, servings: 1, base_calories_kcal: 110, base_eat_minutes: 4 },
  { name: "Goldfish Crackers", serving_label: "55 pieces", calories_kcal: 140, eat_minutes: 5, servings: 1, base_calories_kcal: 140, base_eat_minutes: 5 },
  { name: "Granola Bar (Oats 'n Honey)", serving_label: "1 bar", calories_kcal: 190, eat_minutes: 3, servings: 1, base_calories_kcal: 190, base_eat_minutes: 3 },
  // More Drinks
  { name: "Gatorade", serving_label: "1 bottle (20 oz)", calories_kcal: 140, eat_minutes: 4, servings: 1, base_calories_kcal: 140, base_eat_minutes: 4 },
  { name: "Beer (Light)", serving_label: "1 can (12 oz)", calories_kcal: 103, eat_minutes: 5, servings: 1, base_calories_kcal: 103, base_eat_minutes: 5 },
  { name: "Red Wine", serving_label: "1 glass (5 oz)", calories_kcal: 125, eat_minutes: 10, servings: 1, base_calories_kcal: 125, base_eat_minutes: 10 },
  // More Fast Food
  { name: "Chipotle Chicken Burrito", serving_label: "1 burrito", calories_kcal: 1080, eat_minutes: 15, servings: 1, base_calories_kcal: 1080, base_eat_minutes: 15 },
  { name: "Starbucks Iced Caramel Macchiato", serving_label: "Grande (16 oz)", calories_kcal: 250, eat_minutes: 6, servings: 1, base_calories_kcal: 250, base_eat_minutes: 6 },
  { name: "Dunkin' Glazed Donut", serving_label: "1 donut", calories_kcal: 260, eat_minutes: 2, servings: 1, base_calories_kcal: 260, base_eat_minutes: 2 },
  { name: "Wendy's Dave's Single", serving_label: "1 burger", calories_kcal: 570, eat_minutes: 7, servings: 1, base_calories_kcal: 570, base_eat_minutes: 7 },
  { name: "Burger King Whopper", serving_label: "1 burger", calories_kcal: 660, eat_minutes: 8, servings: 1, base_calories_kcal: 660, base_eat_minutes: 8 },
  { name: "Chick-fil-A Chicken Sandwich", serving_label: "1 sandwich", calories_kcal: 440, eat_minutes: 6, servings: 1, base_calories_kcal: 440, base_eat_minutes: 6 },
  { name: "Five Guys Cheeseburger", serving_label: "1 burger", calories_kcal: 840, eat_minutes: 10, servings: 1, base_calories_kcal: 840, base_eat_minutes: 10 },
];
