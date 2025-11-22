/**
 * Offer Subscription
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource, Strings} from '@app/common';
import {EStyleSheet, shadow} from '@app/styles';

type Props = {};

type State = {
  visible: boolean,
};

const {photodiary} = Strings;

class OfferSubscription extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible: false};
  }

  show() {
    this.setState({visible: true});
  }

  hide = () => {
    this.setState({visible: false});
  };

  render() {
    const {visible} = this.state;
    return (
      <>
        <Modal
          visible={visible}
          animationType="fade"
          transparent
          statusBarTranslucent>
          <View style={styles.container}>
            <Image source={ImageSource.logoIcon} style={styles.avatar} />
            <Label style={styles.labelStyle}>
              {photodiary.rewardOfferMessage}
            </Label>
            <Label style={[styles.labelStyle, styles.paddingVertical]}>
              {photodiary.newPrice}
            </Label>
            <Label style={[styles.labelStyle, styles.fadeStyle]}>
              {photodiary.oldPrice}
            </Label>
            <Button
              title={photodiary.acceptOffer}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonStyle}
              onPress={this.hide}
            />
            <Label
              style={[styles.labelStyle, styles.underlineStyle]}
              onPress={this.hide}>
              {photodiary.noThanks}
            </Label>
          </View>

          <TouchableWithoutFeedback onPress={this.hide}>
            <View style={styles.absoluteFill} />
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  }
}

export default OfferSubscription;

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '320@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingBottom: '10@ms',
    ...shadow,
    borderRadius: '20@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  avatar: {
    width: '100@ms',
    height: 'auto',
    aspectRatio: 1,
    marginVertical: '20@ms',
    resizeMode: 'contain',
  },
  labelStyle: {
    color: 'rgb(0,25,107)',
    textAlign: 'center',
    fontSize: '18@ms',
    lineHeight: '25@ms',
  },
  paddingVertical: {
    paddingTop: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    borderWidth: 2,
    borderColor: '$colors.primary',
    borderRadius: '28@ms',
    ...shadow,
    elevation: 0,
  },
  buttonTitle: {
    color: 'rgb(0,25,107)',
    fontSize: '18@ms',
  },
  fadeStyle: {
    opacity: 0.5,
    paddingVertical: '5@ms',
  },
  underlineStyle: {
    textDecorationLine: 'underline',
    opacity: 0.5,
    paddingVertical: '14@ms',
  },
});
