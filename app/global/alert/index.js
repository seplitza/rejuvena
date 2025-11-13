/**
 * Global Alert
 * @flow
 * @format
 */

import React from 'react';
import {View as AnimatedView} from 'react-native-animatable';
import {View, Pressable, BackHandler} from 'react-native';
import {withTranslation} from '@app/translations';
import {RefHelper} from '@app/utils';
import {Label} from '@app/components';
import {styles} from './styles';

const key = 'global-alert';

// Types
type Props = {
  t: Function,
};

type State = {
  visible: boolean,
};

class GlobalAlert extends React.Component<Props, State> {
  title: string;
  message: string;
  buttons: Array<Object>;

  constructor(props: Props) {
    super(props);
    this.state = {visible: false};
  }

  componentDidMount() {
    // Add alert reference to global refs
    RefHelper.addRef(key, this);
  }

  onBackPress = () => {
    const {visible} = this.state;
    if (visible) {
      this.hideAlert();
      return true;
    }
    return false;
  };

  componentWillUnmount() {
    RefHelper.removeRef(key);
  }

  getDefaultButtons() {
    const {t} = this.props;

    return [
      {
        title: t('common.ok'),
        onPress: this.hideAlert,
      },
    ];
  }

  alert(title: string, message: string, buttons: Array<Object>) {
    if (this.state.visible) {
      return;
    }

    this.title = title;
    this.message = message;
    this.buttons = buttons || this.getDefaultButtons();
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    this.setState({visible: true});
  }

  renderButton = (label, onPress, type) => {
    const {t} = this.props;

    return (
      <Pressable
        delayPressIn={0}
        key={label}
        style={styles.buttonStyle}
        onPress={() => {
          this.hideAlert();
          onPress();
        }}>
        <Label
          numberOfLines={1}
          style={[styles.buttonLabelStyle, styles[type]]}>
          {t(label)}
        </Label>
      </Pressable>
    );
  };

  hideAlert = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    this.setState({visible: false});
  };

  render() {
    const {visible} = this.state;

    if (!visible) {
      return null;
    }

    const {t} = this.props;

    return (
      <View style={styles.container}>
        <AnimatedView animation="zoomIn" duration={200} style={styles.alertBox}>
          {!!this.title && (
            <Label numberOfLines={2} style={styles.titleStyle}>
              {t(this.title)}
            </Label>
          )}
          {!!this.message && (
            <Label numberOfLines={15} style={styles.messageStyle}>
              {t(this.message)}
            </Label>
          )}

          <View style={styles.buttonContainer}>
            {this.buttons?.map(({title, onPress, type}) => {
              return this.renderButton(title, onPress, type);
            })}
          </View>
        </AnimatedView>
      </View>
    );
  }
}

/**
 * Show alert
 */
export const showAlert = (
  title: string,
  message: string,
  buttons?: Array<{title: string, type?: string, onPress: Function}>,
) => {
  const ref = RefHelper.getRef(key);
  // calling function of GlobalAlert class through reference
  ref && ref.alert(title, message, buttons);
};

export const Alert = withTranslation()(GlobalAlert);
