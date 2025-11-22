/**
 * App Constants
 * @flow
 * @format
 */

/**
 * App routes constants for define
 * screen key in navigator and use
 * them for navigate to that screen
 */
const Routes = {
  // Auth stack
  LoginScreen: 'LoginScreen',
  SignUpScreen: 'SignUpScreen',
  SignupByEmailScreen: 'SignupByEmailScreen',
  ForgotPasswordScreen: 'ForgotPasswordScreen',
  OnBoardingScreen: 'OnBoardingScreen',
  TermAndConditionScreen: 'TermAndConditionScreen',
  PrivacyPolicyScreen: 'PrivacyPolicyScreen',
  GuestUserScreen: 'GuestUserScreen',
  CourseDescriptionScreenForGuestUser: 'CourseDescriptionScreenForGuestUser',
  //Main Section
  OrderListScreen: 'OrderListScreen',
  CourseDescriptionScreen: 'CourseDescriptionScreen',
  ExerciseScreen: 'ExerciseScreen',
  NotificationScreen: 'NotificationScreen',
  PhotoDiaryScreen: 'PhotoDiaryScreen',
  CongratsScreen: 'CongratsScreen',
  ViewPDFScreen: 'OpenPDFScreen',
  UserProfileScreen: 'UserProfileScreen',
  UserFeedBackScreen: 'UserFeedBackScreen',
  DescriptionCommentTabScreen: 'DescriptionCommentTabScreen',
  VotingScreen: 'VotingScreen',
  WinnersScreen: 'WinnersScreen',
};

/**
 * App section constants for
 * switch between app section
 * like: (Auth, Onboarding, Main)
 */
const AppSection = {
  AuthSection: 'AuthSection',
  OnboardingSection: 'OnboardingSection',
  MainSection: 'MainSection',
};

export {Routes, AppSection};
