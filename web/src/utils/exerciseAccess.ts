/**
 * Exercise Access and Pricing Utilities
 * Determines if exercise is free/paid and calculates price based on tags
 */

export interface ExerciseAccessInfo {
  isFree: boolean;
  isPremium: boolean;
  price: number;
  priceType: 'free' | 'basic' | 'pro';
}

/**
 * Check if exercise is free based on tags
 * Priority: "Бесплатное" tag has HIGHEST priority (overrides all others)
 * Free exercises: with "Бесплатное" tag (even if they also have PRO/Базовое)
 * Premium exercises: "Базовое" (100₽) or "продвинутое"/"PRO" (200₽)
 */
export function getExerciseAccess(tags: string[]): ExerciseAccessInfo {
  const tagNames = tags.map(t => t.toLowerCase());
  
  // Check for FREE tag FIRST (highest priority - overrides everything!)
  const hasFreeTag = tagNames.includes('бесплатное') || tagNames.includes('на здоровье');
  
  if (hasFreeTag) {
    return {
      isFree: true,
      isPremium: false,
      price: 0,
      priceType: 'free',
    };
  }
  
  // Check for premium tags
  const hasProTag = tagNames.includes('продвинутое') || tagNames.includes('pro');
  const hasBasicTag = tagNames.includes('базовое') || tagNames.includes('платное базовое');
  
  // PRO level - 200₽
  if (hasProTag) {
    return {
      isFree: false,
      isPremium: true,
      price: 200,
      priceType: 'pro',
    };
  }
  
  // Basic level - 100₽
  if (hasBasicTag) {
    return {
      isFree: false,
      isPremium: true,
      price: 100,
      priceType: 'basic',
    };
  }
  
  // Default: premium basic if no tags specified
  return {
    isFree: false,
    isPremium: true,
    price: 100,
    priceType: 'basic',
  };
}

/**
 * Check if user has access to exercise
 * Checks: 1) Premium status (all access) 2) Individual purchase in localStorage
 */
export function hasUserAccess(exerciseId: string, userIsPremium?: boolean): boolean {
  // Premium users have access to ALL exercises
  if (userIsPremium) return true;
  
  // Check localStorage for purchased exercises
  if (typeof window === 'undefined') return false;
  
  try {
    const purchased = localStorage.getItem('purchased_exercises');
    if (!purchased) return false;
    
    const purchasedList: string[] = JSON.parse(purchased);
    return purchasedList.includes(exerciseId);
  } catch {
    return false;
  }
}

/**
 * Mark exercise as purchased
 * TODO: Replace with actual backend call
 */
export function markAsPurchased(exerciseId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const purchased = localStorage.getItem('purchased_exercises');
    const purchasedList: string[] = purchased ? JSON.parse(purchased) : [];
    
    if (!purchasedList.includes(exerciseId)) {
      purchasedList.push(exerciseId);
      localStorage.setItem('purchased_exercises', JSON.stringify(purchasedList));
    }
  } catch (error) {
    console.error('Failed to mark exercise as purchased:', error);
  }
}

/**
 * Get display badge for exercise based on access type
 */
export function getExerciseBadge(accessInfo: ExerciseAccessInfo): string | null {
  if (accessInfo.isFree) return 'На здоровье';
  
  switch (accessInfo.priceType) {
    case 'pro':
      return 'PRO';
    case 'basic':
      return 'Базовое';
    default:
      return null;
  }
}
