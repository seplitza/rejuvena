import React, {useState} from 'react';
import {View, Image, Modal, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ImageSource} from '@app/common';
import {useTranslation} from '@app/translations';
import {Label} from '@app/components';
import {feedbackPopupStyles as styles} from './styles';

const FeedbackPopup = () => {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const hide = () => {
    setVisible(false);
  };
  const navigateToUserFeedbackScreen = () => {
    navigation.navigate('UserFeedBackScreen');
    hide();
  };
  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={hide}>
      <View style={styles.container}>
        <Image source={ImageSource.logoIcon} style={styles.logoStyle} />
        <Label style={styles.titleStyle}>
          {t('userMarathonDailyExercisePage.giveFeedback')}
        </Label>
        <Label style={styles.feedbackMessageStyle}>
          {t('userMarathonDailyExercisePage.feedbackRequest')}
        </Label>
        <View style={styles.buttonContainer}>
          <Label style={styles.buttonTitleStyle} onPress={hide}>
            {t('userMarathonDailyExercisePage.cancel')}
          </Label>
          <Label
            style={styles.buttonTitleStyle}
            onPress={navigateToUserFeedbackScreen}>
            {t('userMarathonDailyExercisePage.rate')}
          </Label>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export {FeedbackPopup};
