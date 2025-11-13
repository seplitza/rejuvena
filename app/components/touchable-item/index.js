/**
 * TouchableItem Item
 * @flow
 * @format
 */

import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ripple } from '../ripple-button';

type Props = {
  pressColor: string,
  disabled?: boolean,
  borderless?: boolean,
  delayPressIn?: number,
  onPress?: () => void,
  children: React$Node,
  style: any,
};

const ANDROID_VERSION_LOLLIPOP = 21;

export class TouchableItem extends React.Component<Props> {
  static defaultProps = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchable on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const {
        style,
        pressColor,
        borderless = false,
        children,
        ...rest
      } = this.props;

      return (
        <TouchableNativeFeedback
          {...rest}
          useForeground={TouchableNativeFeedback.canUseNativeForeground()}
          background={TouchableNativeFeedback.Ripple(pressColor, borderless)}
        >
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    } else if (Platform.OS === 'ios') {
      return (
        <Ripple
          {...this.props}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          {this.props.children}
        </Ripple>
      );
    } else {
      return (
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
