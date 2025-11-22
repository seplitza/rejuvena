/**
 * Common Selectors
 * @flow
 * @format
 */

import {createSelector} from '@reduxjs/toolkit';

const root = (state) => state.commonReducer;
const loaderRoot = (state) => state.loaderAndErrorReducer;

export const selectActiveSection = createSelector(
  root,
  (common) => common.activeSection,
);

export const selectInitialRoute = createSelector(
  root,
  (common) => common.sectionInitialRoute,
);

export const selectAuthToken = createSelector(
  root,
  (common) => common.authToken,
);

export const selectLoaderVisible = createSelector(
  loaderRoot,
  (loader) => loader.loaderCount > 0,
);

export const selectGeneralSettings = createSelector(
  root,
  (common) => common.generalSettings,
);

export const selectPlayerId = createSelector(root, (common) => common.playerId);

export const selectNewUser = createSelector(root, (common) => common.isNewUser);

export const selectLanguage = createSelector(root, (common) => common.language);

export const selectGuestUser = createSelector(
  root,
  (common) => common.isGuestUser,
);

export const selectShouldShowTooltip = createSelector(
  root,
  (common) => common.shouldShowTooltip,
);
