/**
 * Photo Upload Instruction Popup
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {View, Modal, Image, TouchableWithoutFeedback} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource} from '@app/common';
import {EStyleSheet, shadow} from '@app/styles';

class PhotoUploadInstructionPopup extends Component {
  render() {
    const {t, onRequestClose, visible} = this.props;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onRequestClose}
        statusBarTranslucent>
        <View style={styles.container}>
          <Image source={ImageSource.logoIcon} style={styles.avatar} />
          <Label style={styles.messageStyle}>
            {t('photoDiaryPage.photoUploadInstructionMessage')}
          </Label>
          <Button
            title={t('common.ok')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={onRequestClose}
          />
        </View>

        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.absoluteFill} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export {PhotoUploadInstructionPopup};

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
    color: '$colors.errorColor',
    fontSize: '22@ms',
    textAlign: 'center',
    lineHeight: '25@ms',
    padding: '20@ms',
  },
  buttonStyle: {
    backgroundColor: '$colors.textColor',
    borderRadius: '28@ms',
    borderColor: '$colors.primary',
    borderWidth: 2,
  },
  buttonTitleStyle: {
    color: '$colors.primary',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
});
