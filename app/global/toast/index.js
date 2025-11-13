/**
 * Toast
 * @flow
 * @format
 */

import React from 'react';
import {View as AnimatedView} from 'react-native-animatable';
import {RefHelper} from '@app/utils';
import {withTranslation} from '@app/translations';
import {Label} from '@app/components';
import {vh} from '@app/styles';
import {styles} from './styles';

const key = 'app-toast';

export const DURATION = {
  SHORT: 3000,
  LONG: 4000,
};

// Types
type Props = {
  t: Function,
};

type State = {
  visible: boolean,
  message: string,
  duration?: number,
  position?: number,
  type?: string,
};

// Toast options types
type Options = {
  message: string,
  duration?: number,
  position?: 'top' | 'bottom' | 'center',
  type: 'default' | 'error' | 'success',
  backgroundColor: 'string',
};

class GlobalToast extends React.Component<Props, State> {
  animatedViewRef: AnimatedView;

  constructor(props: Object) {
    super(props);
    this.state = {visible: false, message: ''};
  }

  componentDidMount() {
    // Add toast ref to global refs
    RefHelper.addRef(key, this);
  }

  show({
    message,
    duration = DURATION.SHORT,
    position = 'bottom',
    type = 'default',
    backgroundColor,
  }: Options) {
    const positionMap = {top: vh * 10, bottom: vh * 80, center: vh * 50};

    this.setState({
      position: positionMap[position],
      duration,
      message,
      visible: true,
      type,
      backgroundColor,
    });
  }

  close = () => {
    const delay = this.state.duration;

    this.animatedViewRef?.fadeOut(300, delay).then((endState) => {
      if (endState.finished) {
        this.setState({visible: false});
      }
    });
  };

  render() {
    const {visible} = this.state;

    if (!visible) {
      return null;
    }

    const {message, position, type, backgroundColor} = this.state;
    const {t} = this.props;

    return (
      <AnimatedView
        ref={(animatedViewRef) => {
          this.animatedViewRef = animatedViewRef;
        }}
        duration={300}
        animation="zoomIn"
        onAnimationEnd={this.close}
        style={[
          styles.container,
          {top: position},
          styles[type],
          backgroundColor && {backgroundColor},
        ]}>
        <Label style={styles.textStyle}>{t(message)}</Label>
      </AnimatedView>
    );
  }

  componentWillUnmount() {
    RefHelper.removeRef(key);
  }
}

// Display toast
export const showToast = (options: Options) => {
  const ref = RefHelper.getRef(key);
  // calling function of Toast class through reference
  ref && ref.show(options);
};

export const Toast = withTranslation()(GlobalToast);
