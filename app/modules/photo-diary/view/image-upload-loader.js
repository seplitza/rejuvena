/**
 * Image Upload Loader
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import {Bar} from 'react-native-progress';
import {Label} from '@app/components';
import {EStyleSheet} from '@app/styles';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lottieStyle: {
    height: '250@ms',
    marginBottom: '20@ms',
  },
  progressBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingLabelStyle: {
    position: 'absolute',
    fontSize: '15@ms',
    color: '$colors.darkTextColor',
    zIndex: 100,
  },
  progressBarStyles: {
    width: '250@ms',
    height: '18@ms',
    borderRadius: '10@ms',
  },
});

type Props = {
  visible: number,
};

const ImageUploadLoader = (props: Props) => {
  const {visible, progress, t} = props;

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="fade"
      visible={visible}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop
          source={require('@app/assets/animation/face-detection.json')}
          style={styles.lottieStyle}
        />

        <View style={styles.progressBarContainer}>
          <Label style={styles.processingLabelStyle}>
            {progress < 100
              ? `${progress}%`
              : t('photoDiaryPage.processingImage')}
          </Label>
          <Bar
            color="#6fd1cc"
            unfilledColor="#fff"
            width={styles.progressBarStyles.width}
            height={styles.progressBarStyles.height}
            borderRadius={styles.progressBarStyles.borderRadius}
            indeterminate={progress === 100}
            progress={progress / 100}
            useNativeDriver
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImageUploadLoader;
