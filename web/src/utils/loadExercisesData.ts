/**
 * Utility to load exercises data from API
 * Used to populate exercise details with videos and descriptions
 */

import { request } from '@/api/request';
import * as endpoints from '@/api/endpoints';

// Course "Омолодись" - Marathon ID
const OMOLODJIS_MARATHON_ID = '3842e63f-b125-447d-94a1-b1c93be38b4e';
// Day with all base exercises (including "На валике") - Day ID  
const NECK_EXERCISES_DAY_ID = 'cd0f536a-f2ac-4494-a0e3-159a2504317d';

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

    console.log('📦 API Response:', response);
    console.log('📋 Available exercises:', response.exercises?.map((ex: any) => ({
      id: ex.id,
      marathonExerciseId: ex.marathonExerciseId,
      name: ex.exerciseName,
    })));

    // Find the exercise by marathonExerciseId
    const exercise = response.exercises?.find((ex: any) => 
      ex.marathonExerciseId === marathonExerciseId || ex.id === marathonExerciseId
    );

    if (!exercise) {
      console.warn(`❌ Exercise ${marathonExerciseId} not found in API response`);
      console.log('Looking for:', marathonExerciseId);
      console.log('Available IDs:', response.exercises?.map((ex: any) => ex.marathonExerciseId));
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
