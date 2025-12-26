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
  addChangingStatusRequest,
  removeChangingStatusRequest,
  updateExerciseStatus,
  DayExerciseResponse,
} from './slice';

// Get timezone offset in minutes
function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset();
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
    const timeZoneOffset = getTimezoneOffset();
    
    // CRITICAL: Must call StartMarathon before GetDayExercise
    // This initializes the marathon for the user
    console.log('🚀 Starting marathon before loading exercises...');
    const marathonData = yield call(
      request.get,
      endpoints.get_start_marathon,
      {
        params: {
          marathonId,
          timeZoneOffset,
        },
      }
    );
    console.log('✅ Marathon started, marathon data:', marathonData);
    
    // Extract day number from dayId (e.g., "day-1" -> 1)
    const dayNumber = parseInt(dayId.replace('day-', ''), 10);
    console.log(`📅 Looking for day #${dayNumber} in marathon days...`);
    
    // Find the actual day ID (GUID) from marathon days
    const marathonDays = marathonData?.marathonDays || [];
    const dayData = marathonDays.find((d: any) => d.day === dayNumber);
    
    if (!dayData) {
      throw new Error(`Day ${dayNumber} not found in marathon`);
    }
    
    const actualDayId = dayData.id;
    console.log(`✅ Found day ${dayNumber} with ID: ${actualDayId}`);
    console.log('🔄 Now loading exercises...');
    
    const response: DayExerciseResponse = yield call(
      request.get,
      endpoints.get_day_exercises,
      {
        params: {
          marathonId,
          dayId: actualDayId,  // Use GUID, not slug
          timeZoneOffset,
        },
      }
    );
    
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
    
    // Call API
    yield call(
      request.post,
      endpoints.change_exercise_status,
      {
        dayId,
        marathonExerciseId,
        status: status ? 'Completed' : 'NotStarted',
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
