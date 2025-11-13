/**
 * Upload PhotoDiary Popup
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {View, Image, Modal, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {Label, Button} from '@app/components';
import {setUploadedPhotodiary} from '@app/modules/photo-diary/slice';
import {ImageSource, Routes} from '@app/common';
import {withTranslation} from '@app/translations';
import {EStyleSheet, shadow} from '@app/styles';

const UploadPhotoDiary = (props) => {
  const [visible, setVisible] = useState(true);
  const {navigation, t, isItForAfter} = props;
  const hide = () => {
    setVisible(false);
    props.setUploadedPhotodiary(isItForAfter);
  };

  const gotoPhotodiary = () => {
    hide();
    navigation.navigate(Routes.PhotoDiaryScreen);
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={hide}
      statusBarTranslucent>
      <View style={styles.container}>
        <Image source={ImageSource.logoIcon} style={styles.logoStyle} />
        <Label style={styles.messageStyle}>
          {isItForAfter
            ? t('marathonStartPage.afterPhotodiaryMessage')
            : t('marathonStartPage.beforePhotodiaryMessage')}
        </Label>
        <Button
          title={t('marathonStartPage.gotoPhotoDiary')}
          containerStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={gotoPhotodiary}
        />
        <Label style={styles.noThankLabelStyle} onPress={hide}>
          {t('marathonStartPage.noThankYou')}
        </Label>
      </View>

      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default withTranslation()(
  connect(null, {
    setUploadedPhotodiary,
  })(UploadPhotoDiary),
);
export const styles = EStyleSheet.create({
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
  messageStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    textAlign: 'center',
    lineHeight: '30@ms',
    paddingVertical: '20@ms',
  },
  logoStyle: {
    height: '100@ms',
    width: '100@ms',
  },
  buttonStyle: {
    borderRadius: '28@ms',
    borderColor: 'rgb(0,25,107)',
    borderWidth: 2,
  },
  noThankLabelStyle: {
    color: 'rgba(0,25,107,.5)',
    fontSize: '20@ms',
    lineHeight: '32@ms',
    textDecorationLine: 'underline',
  },
  buttonTitleStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
});
