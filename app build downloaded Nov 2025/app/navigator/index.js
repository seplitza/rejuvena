/**
 * App Navigation
 * @flow
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NavigationService, connectStructuredSelector} from '@app/utils';
import {AppSection} from '@app/common';
import {selectActiveSection} from '@app/modules/common/selectors';
import {AuthSection} from './auth-section';
import {MainSection} from './main-section';

// Get current active section
function getActiveSection(activeSection: string) {
  switch (activeSection) {
    case AppSection.MainSection:
      return MainSection();
    default:
      return AuthSection();
  }
}

// Types
type Props = {
  activeSection: string,
};

// App Navigator
const AppNavigator = ({activeSection}: Props) => {
  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      {getActiveSection(activeSection)}
    </NavigationContainer>
  );
};

const mapStateToProps = {
  activeSection: selectActiveSection,
};

export const Navigator =
  connectStructuredSelector(mapStateToProps)(AppNavigator);
