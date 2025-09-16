import { CustomActivity, WeeklyChallengeProgress, GamificationProfile, AchievementKey, LeaderboardEntry } from "../types";

const IMAGE_STORAGE_KEY = 'analyzedFoodImages';
const CUSTOM_ACTIVITIES_KEY = 'customActivities';
const CHALLENGE_STORAGE_KEY = 'weeklyChallengeProgress';
const GAMIFICATION_KEY = 'gamificationProfile';
const MAX_IMAGES = 12; // Keep the gallery size reasonable

// We'll store an array of base64 data URLs
type StoredImages = string[];

export const getStoredImages = (): StoredImages => {
  try {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to retrieve images from local storage:", error);
    return [];
  }
};

export const addStoredImage = (imageData: string): StoredImages => {
  let images = getStoredImages();
  // Avoid duplicates by removing the image if it already exists
  images = images.filter(img => img !== imageData);
  // Add the new image to the beginning of the array
  images.unshift(imageData);
  // Enforce the maximum number of images
  if (images.length > MAX_IMAGES) {
    images = images.slice(0, MAX_IMAGES);
  }
  try {
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error("Failed to save image to local storage:", error);
  }
  return images;
};

export const deleteStoredImage = (indexToDelete: number): StoredImages => {
  const images = getStoredImages();
  if (indexToDelete >= 0 && indexToDelete < images.length) {
    images.splice(indexToDelete, 1);
    try {
      localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error("Failed to update local storage after deletion:", error);
    }
  }
  return images;
};

// --- Custom Activities ---

export const getCustomActivities = (): CustomActivity[] => {
    try {
        const stored = localStorage.getItem(CUSTOM_ACTIVITIES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to retrieve custom activities from local storage:", error);
        return [];
    }
};

export const saveCustomActivities = (activities: CustomActivity[]): void => {
    try {
        localStorage.setItem(CUSTOM_ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (error) {
        console.error("Failed to save custom activities to local storage:", error);
    }
};

// --- Weekly Helpers ---

// Helper to get the start of the current week (Monday)
const getWeekStartDate = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};


// --- Weekly Challenge ---

export const getWeeklyChallengeProgress = (): WeeklyChallengeProgress => {
  const today = new Date();
  const currentWeekStartDate = getWeekStartDate(today);
  const defaultProgress: WeeklyChallengeProgress = {
    savedCalories: 0,
    weekStartDate: currentWeekStartDate,
  };

  try {
    const stored = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (!stored) {
      return defaultProgress;
    }
    
    const progress: WeeklyChallengeProgress = JSON.parse(stored);

    // If the stored week is not the current week, reset it
    if (progress.weekStartDate !== currentWeekStartDate) {
      return defaultProgress;
    }

    return progress;

  } catch (error) {
    console.error("Failed to retrieve challenge progress:", error);
    return defaultProgress;
  }
};

export const saveWeeklyChallengeProgress = (progress: WeeklyChallengeProgress): void => {
  try {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save challenge progress:", error);
  }
};

// --- Gamification ---

const getDefaultGamificationProfile = (): GamificationProfile => ({
  wellnessPoints: 0,
  weeklyWellnessPoints: 0,
  lastWeeklyPointsReset: null,
  mindfulEatingStreak: {
    count: 0,
    lastLogDate: null,
  },
  achievements: {},
  stats: {
    totalAnalyses: 0,
    totalSwaps: 0,
    totalCaloriesSaved: 0,
    totalAiAnalyses: 0,
  },
});

export const getGamificationProfile = (): GamificationProfile => {
  try {
    const stored = localStorage.getItem(GAMIFICATION_KEY);
    const defaultProfile = getDefaultGamificationProfile();
    if (!stored) {
      return defaultProfile;
    }
    
    let profile: GamificationProfile = { ...defaultProfile, ...JSON.parse(stored) };

    // Check and reset weekly points
    const today = new Date();
    const currentWeekStartDate = getWeekStartDate(today);
    if (profile.lastWeeklyPointsReset !== currentWeekStartDate) {
      profile.weeklyWellnessPoints = 0;
      profile.lastWeeklyPointsReset = currentWeekStartDate;
    }

    return profile;
  } catch (error) {
    console.error("Failed to retrieve gamification profile:", error);
    return getDefaultGamificationProfile();
  }
};

export const saveGamificationProfile = (profile: GamificationProfile): void => {
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save gamification profile:", error);
  }
};

type GamificationEvent = 'ANALYSIS_COMPLETE' | 'AI_ANALYSIS' | 'HEALTHY_SWAP';

export const updateGamificationData = (
  event: GamificationEvent,
  payload?: any
): { updatedProfile: GamificationProfile; newAchievements: AchievementKey[] } => {
  const profile = getGamificationProfile();
  let pointsToAdd = 0;
  const newAchievements: AchievementKey[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // --- Handle Events and Points ---
  switch (event) {
    case 'ANALYSIS_COMPLETE':
      if (profile.stats.totalAnalyses === 0) {
        pointsToAdd += 100; // First analysis bonus
      }
      profile.stats.totalAnalyses += 1;

      // Update Mindful Eating Streak
      if (profile.mindfulEatingStreak.lastLogDate !== todayStr) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (profile.mindfulEatingStreak.lastLogDate === yesterdayStr) {
          profile.mindfulEatingStreak.count += 1;
        } else {
          profile.mindfulEatingStreak.count = 1;
        }
        profile.mindfulEatingStreak.lastLogDate = todayStr;
      }
      break;

    case 'AI_ANALYSIS':
      pointsToAdd += 20;
      profile.stats.totalAiAnalyses += 1;
      break;

    case 'HEALTHY_SWAP':
      if (payload?.caloriesSaved > 0) {
        pointsToAdd += 50; // Base points for a swap
        pointsToAdd += Math.floor(payload.caloriesSaved / 10); // Bonus points
        profile.stats.totalSwaps += 1;
        profile.stats.totalCaloriesSaved += payload.caloriesSaved;
      }
      break;
  }

  profile.wellnessPoints += pointsToAdd;
  profile.weeklyWellnessPoints += pointsToAdd;

  // --- Check for Achievements ---
  const checkAndAddAchievement = (key: AchievementKey) => {
    if (!profile.achievements[key]) {
      profile.achievements[key] = true;
      newAchievements.push(key);
    }
  };

  if (profile.stats.totalAnalyses >= 1) checkAndAddAchievement('firstStep');
  if (profile.stats.totalSwaps >= 1) checkAndAddAchievement('savvySwapper');
  if (profile.stats.totalCaloriesSaved >= 1000) checkAndAddAchievement('calorieCommando');
  if (profile.stats.totalAiAnalyses >= 5) checkAndAddAchievement('aiAnalyst');

  // Weekend Warrior is checked on analysis completion
  if (event === 'ANALYSIS_COMPLETE') {
    const dayOfWeek = today.getDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      checkAndAddAchievement('weekendWarrior');
    }
  }

  saveGamificationProfile(profile);

  return { updatedProfile: profile, newAchievements };
};


// --- Leaderboard Service ---

const FAKE_NAMES = ['Alex', 'Jordan', 'Casey', 'Riley', 'Jessie', 'Morgan', 'Taylor', 'Skyler', 'Cameron', 'Drew'];

const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const getLeaderboardData = (userWeeklyPoints: number): LeaderboardEntry[] => {
    const weekStartDate = getWeekStartDate(new Date());
    // Create a numeric seed from the date string for deterministic "randomness" for the week
    const seed = weekStartDate.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
    
    const data: Omit<LeaderboardEntry, 'rank'>[] = [];

    // Add the current user
    data.push({ name: 'You', points: userWeeklyPoints, isUser: true });

    // Generate fake users
    FAKE_NAMES.forEach((name, index) => {
        // Use the seed to make the random scores consistent for the week
        const randomFactor = seededRandom(seed + index);
        // Generate scores in a plausible range, some higher, some lower than a typical user
        const points = Math.floor(randomFactor * 1500) + 50;
        data.push({ name, points, isUser: false });
    });

    // Sort by points descending
    data.sort((a, b) => b.points - a.points);

    // Assign ranks and limit to top 10
    const rankedData: LeaderboardEntry[] = data.slice(0, 10).map((item, index) => ({
        ...item,
        rank: index + 1
    }));
    
    // Ensure the user is always on the board if they are outside the top 10 but have points
    const userInTop10 = rankedData.some(entry => entry.isUser);
    if (!userInTop10 && userWeeklyPoints > 0) {
        const userRank = data.findIndex(item => item.isUser) + 1;
        // Replace the last item with the user's entry
        rankedData.pop();
        rankedData.push({ rank: userRank, name: 'You', points: userWeeklyPoints, isUser: true });
    }

    return rankedData;
};