/**
 * Navigation Header
 * @flow
 * @format
 */

import React from 'react';
import {Header} from '@app/components';

// Types
type Props = {
  scene: Object,
  previous: any,
  navigation: Object,
};

const NavigationHeader = (props: Props) => {
  const {scene, navigation} = props;

  const {options} = scene?.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : 'Natural Rejuvenation';
  const canAccessDrawer = !!navigation.openDrawer;
  const canGoBack = navigation?.canGoBack();

  return (
    <Header
      title={title}
      canGoBack={canGoBack}
      canAccessDrawer={canAccessDrawer}
    />
  );
};

export {NavigationHeader};
