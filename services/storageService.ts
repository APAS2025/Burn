import { CustomActivity, WeeklyChallengeProgress } from "../types";

const IMAGE_STORAGE_KEY = 'analyzedFoodImages';
const CUSTOM_ACTIVITIES_KEY = 'customActivities';
const CHALLENGE_STORAGE_KEY = 'weeklyChallengeProgress';
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

// --- Weekly Challenge ---

// Helper to get the start of the current week (Monday)
const getWeekStartDate = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};


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