/**
 * Icon on top of react native vector icons
 * @flow
 * @format
 */

import React from 'react';
import type { IconProps } from 'react-native-vector-icons';
import { getIconByType } from './icon-types';

type Props = {
  ...IconProps<any>,
  // Set type of the icon
  type:
    | 'Ionicons'
    | 'Zocial'
    | 'Octicons'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'Foundation'
    | 'EvilIcons'
    | 'Entypo'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'SimpleLineIcons'
    | 'Feather'
    | 'AntDesign',
};

const Icon = (props: Props) => {
  const { type } = props;
  const IconComponent = getIconByType(type);
  return <IconComponent {...props} />;
};

export { Icon };
