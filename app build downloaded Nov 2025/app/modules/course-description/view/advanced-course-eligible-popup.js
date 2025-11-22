/**
 * Advanced Course Eligible Popup
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {View, Modal, Image, TouchableWithoutFeedback} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource} from '@app/common';
import {EStyleSheet, shadow} from '@app/styles';

class AdvancedCourseEligiblePopup extends Component {
  render() {
    const {t, hide, visible} = this.props;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={hide}
        statusBarTranslucent>
        <View style={styles.container}>
          <Image source={ImageSource.logoIcon} style={styles.avatar} />
          <Label style={styles.messageStyle}>
            {t('coursePage.eligibleAdvancedCourseMessage')}
          </Label>
          <Button
            title={t('common.ok')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={hide}
          />
        </View>

        <TouchableWithoutFeedback onPress={hide}>
          <View style={styles.absoluteFill} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export {AdvancedCourseEligiblePopup};

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '350@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '25@ms',
    paddingHorizontal: '15@ms',
    ...shadow,
    borderRadius: '15@ms',
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
  messageStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '22@ms',
    textAlign: 'center',
    lineHeight: '25@ms',
    paddingVertical: '20@ms',
  },
  buttonStyle: {
    backgroundColor: '$colors.primary',
    borderRadius: '28@ms',
    borderColor: '$colors.primary',
    borderWidth: 2,
  },
  buttonTitleStyle: {
    color: '$colors.textColor',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
});
