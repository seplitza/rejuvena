/**
 * Get Star Congratulation Popup
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {View, Image, Modal, TouchableWithoutFeedback} from 'react-native';
import {Label, Button, Rating, Icon} from '@app/components';
import {ImageSource} from '@app/common';
import {useTranslation} from '@app/translations';
import {EStyleSheet, shadow} from '@app/styles';
import MiddleWayPopUp from './middle-way-popup';

const GetStarCongratulation = (props) => {
  const [visible, setVisible] = useState(true);
  const [middleWayPopUpVisible, setMiddleWayPopUpVisible] = useState(false);
  const {star, setVisibleStarPopup} = props;
  const {t} = useTranslation();

  const hide = () => {
    setVisible(false);
    setVisibleStarPopup();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={hide}
      statusBarTranslucent>
      <View style={styles.container}>
        <Icon
          type="AntDesign"
          name="close"
          style={styles.closeIconStyle}
          onPress={hide}
        />
        <Image source={ImageSource.logo} style={styles.logoStyle} />
        <Rating
          rating={star}
          style={styles.starContainer}
          starStyle={styles.starStyle}
        />
        <Label style={styles.messageStyle}>
          {`${star} ${t('userMarathonDailyExercisePage.stars')}\n ${
            star === 3
              ? t('userMarathonDailyExercisePage.threeStarCongratsMessage')
              : t('userMarathonDailyExercisePage.fiveStarCongratsMessage')
          }`}
          <Label
            style={styles.textUnderLine}
            onPress={() => setMiddleWayPopUpVisible(true)}>
            {`${t('userMarathonDailyExercisePage.middleWay')}`}
          </Label>
          😉
          {star === 5 && t('userMarathonDailyExercisePage.havingMoreThan')}
        </Label>
        <Button
          title={t('userMarathonDailyExercisePage.thanks')}
          containerStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={hide}
        />
      </View>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
      <MiddleWayPopUp
        visible={middleWayPopUpVisible}
        hide={() => setMiddleWayPopUpVisible(false)}
      />
    </Modal>
  );
};

export default GetStarCongratulation;

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '360@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '25@ms',
    ...shadow,
    borderRadius: '15@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  closeIconStyle: {
    color: 'rgb(16,0,158)',
    fontSize: '25@ms',
    position: 'absolute',
    right: '15@ms',
    top: '15@ms',
  },
  starContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  starStyle: {
    width: '32@ms',
    height: '32@ms',
    margin: '3@ms',
  },
  textUnderLine: {
    textDecorationLine: 'underline',
    color: 'rgb(0,25,107)',
    fontSize: '17@ms',
  },
  messageStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    textAlign: 'center',
    lineHeight: '30@ms',
    marginBottom: '15@ms',
  },
  logoStyle: {
    height: '120@ms',
    width: '120@ms',
  },
  buttonStyle: {
    borderRadius: '28@ms',
    borderColor: 'rgb(0,25,107)',
    borderWidth: '2@ms',
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
