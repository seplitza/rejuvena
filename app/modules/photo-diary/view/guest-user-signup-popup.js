/**
 * Guest User Signup Popup
 * @flow
 * @format
 */
import React from 'react';
import {View, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource} from '@app/common';
import {EStyleSheet, shadow} from '@app/styles';

type Props = {
  visible: boolean,
  hide: Function,
  navigation: any,
};

const GuestUserSignupPopup = (props: Props) => {
  const {t, visible, hide, navigateToSignUpScreen} = props;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={hide}>
      <View style={styles.container}>
        <Image source={ImageSource.logoIcon} style={styles.avatar} />
        <Label style={styles.labelStyle}>
          {t('photoDiaryPage.uploadPhotosFromAnotherAngle')}
        </Label>
        <Button
          title={t('photoDiaryPage.signup')}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonStyle}
          onPress={navigateToSignUpScreen}
        />
        <Label style={styles.noThanksLabelStyle} onPress={hide}>
          {t('photoDiaryPage.noThanks')}
        </Label>
      </View>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export {GuestUserSignupPopup};

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '340@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: '8@ms',
    borderRadius: '18@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
    ...shadow,
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
    fontSize: '22@ms',
    lineHeight: '25@ms',
    marginVertical: '30@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    borderColor: '$colors.primary',
    borderRadius: '28@ms',
    borderWidth: '2@ms',
    ...shadow,
    elevation: 0,
  },
  buttonTitle: {
    color: '$colors.primary',
    fontSize: '20@ms',
  },
  noThanksLabelStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    textAlign: 'center',
    lineHeight: '35@ms',
    textDecorationLine: 'underline',
    marginBottom: '40@ms',
  },
});
