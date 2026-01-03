/**
 * Utility to load exercises data from API
 * Used to populate exercise details with videos and descriptions
 */

import { request } from '@/api/request';
import * as endpoints from '@/api/endpoints';

// Course "Омолодись" - Marathon ID
const OMOLODJIS_MARATHON_ID = '3842e63f-b125-447d-94a1-b1c93be38b4e';
// Day with neck exercises - Day ID  
const NECK_EXERCISES_DAY_ID = 'e4285131-1339-4a1e-90d8-0c9fdf03b4ee';

/**
 * Load exercise data from API by marathonExerciseId
 */
export async function loadExerciseFromAPI(marathonExerciseId: string) {
  try {
    const timeZoneOffset = -new Date().getTimezoneOffset();
    
    // First, start the marathon to get access
    await request.get(endpoints.get_start_marathon, {
      params: {
        marathonId: OMOLODJIS_MARATHON_ID,
        timeZoneOffset,
      },
    });

    // Then load the day exercises
    const response: any = await request.get(endpoints.get_day_exercises, {
      params: {
        marathonId: OMOLODJIS_MARATHON_ID,
        dayId: NECK_EXERCISES_DAY_ID,
        timeZoneOffset,
      },
    });

    // Find the exercise by marathonExerciseId
    const exercise = response.exercises?.find((ex: any) => 
      ex.marathonExerciseId === marathonExerciseId || ex.id === marathonExerciseId
    );

    if (!exercise) {
      console.warn(`Exercise ${marathonExerciseId} not found in API response`);
      return null;
    }

    return exercise;
  } catch (error: any) {
    console.error('Failed to load exercise from API:', error);
    return null;
  }
}

/**
 * Load all exercises data for the neck exercises list
 */
export async function loadAllNeckExercises() {
  try {
    const timeZoneOffset = -new Date().getTimezoneOffset();
    
    // Start marathon
    await request.get(endpoints.get_start_marathon, {
      params: {
        marathonId: OMOLODJIS_MARATHON_ID,
        timeZoneOffset,
      },
    });

    // Load day exercises
    const response: any = await request.get(endpoints.get_day_exercises, {
      params: {
        marathonId: OMOLODJIS_MARATHON_ID,
        dayId: NECK_EXERCISES_DAY_ID,
        timeZoneOffset,
      },
    });

    return response.exercises || [];
  } catch (error: any) {
    console.error('Failed to load neck exercises:', error);
    return [];
  }
}
