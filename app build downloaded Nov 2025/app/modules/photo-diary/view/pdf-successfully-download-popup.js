/**
 * Open PDF Popup
 * @flow
 * @format
 */

import React from 'react';
import {View, Image, Modal, TouchableWithoutFeedback} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource, Routes} from '@app/common';
import {useTranslation} from '@app/translations';
import {EStyleSheet, shadow} from '@app/styles';

type Props = {
  visible: boolean,
  hide: Function,
  pdfPath: String,
  navigation: Object,
};

const PDFSuccessfullyDownloadPopup = (props: Props) => {
  const {navigation, visible, hide, pdfPath} = props;
  const {t} = useTranslation();

  const gotoOpenPDFScreen = () => {
    hide();
    navigation.navigate(Routes.ViewPDFScreen, {pdfPath});
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
          {t('photoDiaryPage.pdfCollageSaved')}
        </Label>
        <Button
          title={t('photoDiaryPage.openCollagePdf')}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonStyle}
          onPress={gotoOpenPDFScreen}
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

export {PDFSuccessfullyDownloadPopup};

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '320@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '25@ms',
    paddingHorizontal: '10@ms',
    ...shadow,
    borderRadius: '8@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  messageStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '22@ms',
    textAlign: 'center',
    paddingVertical: '20@ms',
    lineHeight: '25@ms',
  },
  logoStyle: {
    height: '100@ms',
    width: '100@ms',
  },
  buttonStyle: {
    backgroundColor: '$colors.primary',
    borderRadius: '28@ms',
    ...shadow,
    elevation: 0,
  },
  noThankLabelStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    lineHeight: '32@ms',
    textDecorationLine: 'underline',
  },
  buttonTitle: {
    color: '#fff',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
});
