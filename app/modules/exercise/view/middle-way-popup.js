/**
 * MiddleWayPopUp
 * @flow
 * @format
 */

import React from 'react';
import {
  View,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Label, Button, Icon} from '@app/components';
import {ImageSource} from '@app/common';
import {useTranslation} from '@app/translations';
import {EStyleSheet, shadow} from '@app/styles';

const windowHeight = Dimensions.get('window').height - 80;

const MiddleWayPopUp = (props) => {
  const {t} = useTranslation();
  const {visible, hide} = props;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={hide}
      statusBarTranslucent>
      <View style={[styles.container, {maxHeight: windowHeight}]}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Icon
            type="AntDesign"
            name="close"
            style={styles.closeIconStyle}
            onPress={hide}
          />
          <Image source={ImageSource.fiveStarLogo} style={styles.logoStyle} />
          <Label style={styles.headingStyle}>
            {t('userMarathonDailyExercisePage.flnMiddleWay')}
          </Label>
          <Label style={styles.messageStyle}>
            {t('userMarathonDailyExercisePage.fnlMiddleWayConcept')}
            <Label style={styles.boldTextStyle}>
              {`${t('userMarathonDailyExercisePage.brieflyEveryDayNot')}`}
            </Label>
            {`${t('userMarathonDailyExercisePage.toHelpYouUnderstand')}`}
            <Image
              source={ImageSource.checkExerciseStatus}
              style={styles.checkImageStyle}
            />
            {`${t('userMarathonDailyExercisePage.somePointsAreCollected')}`}
            <Label style={styles.boldTextStyle}>
              {`${t('userMarathonDailyExercisePage.bigDay')}`}
            </Label>
            {`${t('userMarathonDailyExercisePage.aLotOfSkinCare')}`}
          </Label>
          <View style={styles.weekBoxStyle}>
            <Image
              source={ImageSource.superstar}
              style={styles.superStarImageStyle}
            />
            <View style={styles.dayContainer}>
              <Label style={styles.labelStyle}>
                {t('marathonStartPage.week')}
              </Label>
              <Label style={styles.weekValueStyle}>2</Label>
              <Label style={styles.labelStyle}>
                {t('marathonStartPage.practice')}
              </Label>
            </View>
          </View>
          <Button
            title={t('userMarathonDailyExercisePage.thanks')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={hide}
          />
        </ScrollView>
      </View>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MiddleWayPopUp;

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '360@ms',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    ...shadow,
    borderRadius: '15@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  contentContainerStyle: {
    alignItems: 'center',
    padding: '15@ms',
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  superStarImageStyle: {
    width: '45@ms',
    height: '45@ms',
    alignSelf: 'center',
    position: 'absolute',
    top: '2@ms',
    left: '8@ms',
  },
  weekBoxStyle: {
    width: '62%',
    borderWidth: '2@ms',
    borderRadius: '10@ms',
    borderColor: 'rgba(0,42,183,0.5)',
    alignSelf: 'flex-end',
    paddingVertical: '10@ms',
    marginVertical: '30@ms',
  },
  closeIconStyle: {
    color: 'rgb(16,0,158)',
    fontSize: '25@ms',
    position: 'absolute',
    right: '15@ms',
    top: '15@ms',
  },
  boldTextStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
  },
  messageStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    lineHeight: '30@ms',
    marginBottom: '15@ms',
    fontFamily: '$fonts.DINLight',
  },
  headingStyle: {
    fontSize: '25@ms',
    color: 'rgb(0,25,107)',
    marginTop: '25@ms',
  },
  logoStyle: {
    height: '150@ms',
    width: '150@ms',
    resizeMode: 'contain',
  },
  checkImageStyle: {
    height: '35@ms',
    width: '35@ms',
  },
  buttonStyle: {
    borderRadius: '28@ms',
    borderColor: 'rgb(0,42,183)',
    borderWidth: '2@ms',
  },
  buttonTitleStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: -1,
  },
  weekValueStyle: {
    color: 'rgba(0,42,183,0.5)',
    fontSize: '75@ms',
    fontFamily: '$fonts.PhosphateInline',
    marginBottom: '-16@ms',
  },
  labelStyle: {
    color: 'rgba(0,42,183,0.5)',
    fontSize: '25@ms',
    marginTop: 'auto',
  },
});
