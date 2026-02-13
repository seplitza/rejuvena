/**
 * Marathon Day Sagas
 * Side effects for API calls
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { request } from '../../../api/request';
import * as endpoints from '../../../api/endpoints';
import {
  getDayExercise,
  changeExerciseStatus,
  getDayExerciseRequest,
  getDayExerciseSuccess,
  getDayExerciseFailure,
  setCurrentMarathon,
  addChangingStatusRequest,
  removeChangingStatusRequest,
  updateExerciseStatus,
  DayExerciseResponse,
} from './slice';

// Get timezone offset in minutes
function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset();
}

// Transform new marathon API response to expected format
function transformMarathonDayResponse(apiResponse: any): DayExerciseResponse {
  const { day } = apiResponse;
  
  // Transform exerciseGroups to dayCategories
  const dayCategories = day.exerciseGroups?.map((group: any) => ({
    id: group.categoryId._id || group.categoryId.id,
    categoryName: group.categoryId.name,
    imagePath: group.categoryId.icon || '',
    exercises: group.exerciseIds.map((exercise: any, index: number) => ({
      id: exercise._id || exercise.id,
      marathonExerciseId: exercise._id || exercise.id,
      exerciseName: exercise.title,
      marathonExerciseName: exercise.title,
      description: exercise.description || '',
      videoUrl: exercise.carouselMedia?.find((m: any) => m.type === 'video')?.url || '',
      imageUrl: exercise.carouselMedia?.find((m: any) => m.type === 'image')?.url || '',
      duration: 0,
      type: 'Practice' as const,
      status: 'NotStarted' as const,
      order: index,
      commentsCount: 0,
      isDone: false,
      isNew: exercise.isNew || false,
      blockExercise: false,
    }))
  })) || [];

  // Flatten all exercises
  const allExercises = dayCategories.flatMap((cat: any) => cat.exercises);

  return {
    marathonDay: {
      id: day._id || day.id,
      day: day.dayNumber,
      description: day.description || '',
      dayDate: new Date().toISOString(), // Current date
      isShowThreeStarPopup: false,
      isShowFiveStarPopup: false,
      dayCategories,
    },
    title: `День ${day.dayNumber}`,
    exercises: allExercises,
  };
}

// Fetch day exercises saga
function* getDayExerciseSaga(
  action: PayloadAction<{
    marathonId: string;
    dayId: string;
  }>
): Generator<any, void, any> {
  try {
    yield put(getDayExerciseRequest());
    
    const { marathonId, dayId } = action.payload;
    
    console.log('🔄 Loading marathon day:', { marathonId, dayId });
    
    // Load marathon info, all days, and progress in parallel
    try {
      const [marathonResponse, daysResponse, progressResponse] = yield Promise.all([
        call(request.get, `/api/marathons/${marathonId}`, {}),
        call(request.get, `/api/marathons/${marathonId}/days`, {}),
        call(request.get, `/api/marathons/${marathonId}/progress`, {}),
      ]);
      
      // Save marathon info
      if (marathonResponse.success && marathonResponse.marathon) {
        const marathon = marathonResponse.marathon;
        yield put(setCurrentMarathon({
          _id: marathon._id,
          title: marathon.title,
          imagePath: marathon.imagePath,
          numberOfDays: marathon.numberOfDays,
          startDate: marathon.startDate,
        }));
        console.log('✅ Marathon info loaded:', marathon.title);
      }
      
      // Build marathon data for DaysList
      if (daysResponse.success && progressResponse.success) {
        const allDays = daysResponse.days || [];
        const completedDays = progressResponse.progress?.completedDays || [];
        const currentAvailableDay = progressResponse.progress?.currentDay || 1;
        const marathon = marathonResponse.marathon;
        
        // Calculate current available day from start date
        const now = new Date();
        const startDate = new Date(marathon.startDate);
        const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const maxAvailableDay = daysSinceStart + 1;
        
        // Split into training (1-14) and practice (15+) days
        const marathonDays = allDays
          .filter((d: any) => d.dayNumber <= 14)
          .map((d: any) => ({
            id: d._id,
            day: d.dayNumber,
            title: d.title || `День ${d.dayNumber}`,
            description: d.description,
            dayDate: d.dayDate,
            progress: completedDays.includes(d.dayNumber) ? 100 : 0,
            isLocked: d.dayNumber > maxAvailableDay,
          }));
        
        const greatExtensionDays = allDays
          .filter((d: any) => d.dayNumber > 14)
          .map((d: any) => ({
            id: d._id,
            day: d.dayNumber,
            title: d.title || `День ${d.dayNumber}`,
            description: d.description,
            dayDate: d.dayDate,
            progress: completedDays.includes(d.dayNumber) ? 100 : 0,
            isLocked: d.dayNumber > maxAvailableDay,
          }));
        
        yield put({
          type: 'day/setMarathonData',
          payload: {
            marathonDays,
            greatExtensionDays,
            oldGreatExtensions: [],
            rule: {
              rule: marathon.rules || '',
              welcomeMessage: marathon.welcomeMessage || '',
            },
          },
        });
        
        console.log('✅ Marathon data built:', { 
          trainingDays: marathonDays.length, 
          practiceDays: greatExtensionDays.length,
          completedDays: completedDays.length 
        });
      }
    } catch (marathonError) {
      console.warn('Failed to load marathon info/progress:', marathonError);
      // Continue anyway - day might still load
    }
    
    // Call new marathon API endpoint
    const apiResponse = yield call(
      request.get,
      endpoints.get_marathon_day(marathonId, dayId),
      {}
    );
    
    console.log('✅ Marathon day API response:', apiResponse);
    
    // Transform to expected format
    const response: DayExerciseResponse = transformMarathonDayResponse(apiResponse);
    
    console.log('✅ Transformed response:', response);
    
    yield put(getDayExerciseSuccess(response));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load day exercises';
    yield put(getDayExerciseFailure(errorMessage));
    console.error('getDayExerciseSaga error:', error);
  }
}

// Change exercise status saga
function* changeExerciseStatusSaga(
  action: PayloadAction<{
    marathonExerciseId: string;
    status: boolean;
    dayId: string;
    uniqueId: string;
  }>
): Generator<any, void, any> {
  const { marathonExerciseId, status, dayId, uniqueId } = action.payload;
  
  try {
    // Mark as changing
    yield put(addChangingStatusRequest(uniqueId));
    
    // Call API (status is boolean - true/false)
    yield call(
      request.post,
      endpoints.change_exercise_status,
      {
        dayId,
        marathonExerciseId,
        status,
      }
    );
    
    // Update local state
    yield put(updateExerciseStatus({ uniqueId, status }));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update exercise status';
    console.error('changeExerciseStatusSaga error:', error);
    alert(errorMessage);
  } finally {
    // Remove changing status
    yield put(removeChangingStatusRequest(uniqueId));
  }
}

// Root saga
export function* daySagas() {
  yield takeLatest(getDayExercise.type, getDayExerciseSaga);
  yield takeLatest(changeExerciseStatus.type, changeExerciseStatusSaga);
}
