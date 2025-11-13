/**
 * Collage Download Popup
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource} from '@app/common';
import {collagePopupStyles as styles} from './styles';

type Props = {
  visible: boolean,
  downloadingImageCollage: boolean,
  downloadingPdfCollage: boolean,
  hide: Function,
  onPressImageDownloadCollage: Function,
  onPressPDFDownloadCollage: Function,
};

const CollageDownload = (props: Props) => {
  const {
    t,
    hide,
    visible,
    downloadingImageCollage,
    downloadingPdfCollage,
    onPressImageDownloadCollage,
    onPressPDFDownloadCollage,
  } = props;

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
          {t('photoDiaryPage.downloadCollageMessage')}
        </Label>
        <Button
          title={t('photoDiaryPage.downloadPdf')}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonStyle}
          onPress={onPressPDFDownloadCollage}
          disabled={downloadingPdfCollage || downloadingImageCollage}
          loading={downloadingPdfCollage}
        />
        <Button
          title={t('photoDiaryPage.downloadImage')}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonStyle}
          onPress={onPressImageDownloadCollage}
          disabled={downloadingImageCollage || downloadingPdfCollage}
          loading={downloadingImageCollage}
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

export default CollageDownload;
