/**
 * FaceLift Exercise
 * @flow
 * @format
 */

export {default as ExerciseScreen} from './view/exercise';
export {default as DescriptionCommentTabScreen} from './view/description-comment-tab';

export {exerciseReducer, setCurrentMarathon, setMarathon} from './slice';
export {
  selectIsContestAvailable,
  selectMarathonId,
  selectIsSSC,
  selectIsTabBarVisible,
  selectCourseLanguage,
} from './selectors';
export {exerciseSagas} from './sagas';
