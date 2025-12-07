/**
 * Courses Selectors
 * Memoized selectors for courses state
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// Base selectors
const selectCoursesState = (state: RootState) => state.courses;

// My Orders selectors
export const selectMyOrders = createSelector(
  [selectCoursesState],
  (courses) => courses.myOrders
);

// Alias for compatibility
export const selectUserOrders = selectMyOrders;

// Helper to check if orderId is valid (not empty GUID)
export const isValidOrderId = (orderId: string | undefined): boolean => {
  if (!orderId) return false;
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  return orderId !== emptyGuid && orderId.length > 0;
};

export const selectActiveOrders = createSelector(
  [selectMyOrders],
  (orders) => {
    return orders.filter(order => 
      order.orderStatus === 'Approved' || 
      order.status === 'Active' ||
      order.isPurchased === true
    );
  }
);

export const selectLoadingOrders = createSelector(
  [selectCoursesState],
  (courses) => courses.loadingOrders
);

export const selectOrdersError = createSelector(
  [selectCoursesState],
  (courses) => courses.ordersError
);

// Available Courses selectors
export const selectAvailableCourses = createSelector(
  [selectCoursesState],
  (courses) => courses.availableCourses
);

export const selectDemoCourses = createSelector(
  [selectCoursesState],
  (courses) => courses.demoCourses
);

export const selectAllCourses = createSelector(
  [selectAvailableCourses, selectDemoCourses],
  (available, demo) => [...available, ...demo]
);

// Language selectors
export const selectSelectedLanguage = createSelector(
  [selectCoursesState],
  (courses) => courses.selectedLanguage
);

export const selectAvailableCoursesByLanguage = createSelector(
  [selectAvailableCourses, selectSelectedLanguage],
  (courses, language) => courses.filter(course => course.languageCulture === language)
);

export const selectDemoCoursesByLanguage = createSelector(
  [selectDemoCourses, selectSelectedLanguage],
  (courses, language) => courses.filter(course => course.languageCulture === language)
);

export const selectLoadingCourses = createSelector(
  [selectCoursesState],
  (courses) => courses.loadingCourses
);

export const selectCoursesError = createSelector(
  [selectCoursesState],
  (courses) => courses.coursesError
);

// Course Details selectors
export const selectSelectedCourse = createSelector(
  [selectCoursesState],
  (courses) => courses.selectedCourse
);

export const selectCoursePlans = createSelector(
  [selectCoursesState],
  (courses) => courses.coursePlans
);

export const selectLoadingDetails = createSelector(
  [selectCoursesState],
  (courses) => courses.loadingDetails
);

export const selectDetailsError = createSelector(
  [selectCoursesState],
  (courses) => courses.detailsError
);

// Marathon selectors
export const selectMarathons = createSelector(
  [selectCoursesState],
  (courses) => courses.marathons
);

export const selectMarathonById = (marathonId: string) =>
  createSelector(
    [selectMarathons],
    (marathons) => marathons[marathonId]
  );

export const selectLoadingMarathon = createSelector(
  [selectCoursesState],
  (courses) => courses.loadingMarathon
);

export const selectMarathonError = createSelector(
  [selectCoursesState],
  (courses) => courses.marathonError
);

// Combined selectors
export const selectCoursesWithProgress = createSelector(
  [selectActiveOrders, selectMarathons],
  (orders, marathons) => {
    return orders.map(order => {
      const marathonId = order.wpMarathonId || order.marathonId || order.id;
      return {
        ...order,
        marathonId: marathonId,
        marathon: marathons[marathonId],
        progress: marathons[marathonId]?.progress || 0,
        completedDays: marathons[marathonId]?.completedDays || 0,
        totalDays: marathons[marathonId]?.totalDays || order.days || 0,
      };
    });
  }
);

export const selectIsCoursePurchased = (courseId: string) =>
  createSelector(
    [selectMyOrders],
    (orders) => orders.some(order => 
      (order.marathonId === courseId || order.wpMarathonId === courseId || order.id === courseId) &&
      (order.status === 'Active' || order.orderStatus === 'Approved')
    )
  );

// Check if course has valid access (valid orderId means API will work)
export const selectCourseHasValidAccess = (courseId: string) =>
  createSelector(
    [selectMyOrders],
    (orders) => {
      const order = orders.find(o => 
        o.marathonId === courseId || 
        o.wpMarathonId === courseId || 
        o.id === courseId
      );
      
      return order && isValidOrderId(order.orderId);
    }
  );
