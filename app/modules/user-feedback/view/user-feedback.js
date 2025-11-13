/**
 * User Feedback Screen
 * @flow
 * @format
 */
import React, {useState, useEffect} from 'react';
import {View, Platform, Linking} from 'react-native';
import InAppReview from 'react-native-in-app-review';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Label, Input, Button} from '@app/components';
import {connect} from 'react-redux';
import {AsyncStorage, trackEvent} from '@app/utils';
import {withTranslation} from '@app/translations';
import StarRating from 'react-native-star-rating';
import {gradients} from '@app/styles';
import {setUserFeedback} from '../slice';
import {styles} from './styles';

const UserFeedBackScreen = (props) => {
  const {t} = props;
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    trackEvent('View FeedbackScreen');
    getRating();
  }, []);

  const getRating = async () => {
    const userRating = await AsyncStorage.getItem('rating');
    const starRating = Number(userRating);
    setRating(starRating);
  };
  const platform = Platform.OS;
  const selectedStar = (rate) => {
    setRating(rate);
  };

  const submit = async () => {
    props.setUserFeedback({rating, feedback, platform});
    setFeedback('');
    await AsyncStorage.setItem('rating', rating.toString());
  };

  const rateOnStore = () => {
    const storeURL =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/us/app/facelift-naturally/id1558153613'
        : 'https://play.google.com/store/apps/details?id=com.beautifyacademy';
    Linking.openURL(storeURL);
  };

  const onReview = async () => {
    if (!InAppReview.isAvailable()) {
      rateOnStore();
      return;
    }
    const lastDateAppReviewed = await AsyncStorage.getItem('@review_last_date');
    if (lastDateAppReviewed !== null) {
      let Today = new Date();
      const leftTime = Math.abs(Today - Date.parse(lastDateAppReviewed));
      let leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));

      if (leftDays > 15) {
        await AsyncStorage.setItem('@review_last_date', new Date().toString());
        InAppReview.RequestInAppReview();
      } else {
        rateOnStore();
      }
    } else {
      await AsyncStorage.setItem('@review_last_date', new Date().toString());
      InAppReview.RequestInAppReview();
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}>
      <Label style={styles.titleStyle}>
        {t('userFeedback.howWouldYouRateApp')}
      </Label>
      <StarRating
        starSize={35}
        disabled={false}
        maxStars={5}
        rating={rating}
        selectedStar={selectedStar}
        fullStarColor={'#00259E'}
        containerStyle={styles.ratingContainerStyle}
      />
      <View style={styles.horizontalLine} />
      <Label style={styles.feedbackMessageStyle}>
        {t('userFeedback.feedbackMessage')}
      </Label>
      <Input
        multiline
        value={feedback}
        onChangeText={setFeedback}
        placeholder={t('userFeedback.describeYourExperience')}
        inputStyle={styles.inputStyle}
        containerStyle={styles.inputContainer}
      />
      <Button
        title={t('userFeedback.sendFeedback')}
        enableGradient
        gradientColors={gradients.btn}
        containerStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitleStyle}
        onPress={submit}
        disabled={!rating}
      />
      {rating > 3 && (
        <Button
          title={
            Platform.OS === 'ios'
              ? t('userFeedback.rateOnAppStore')
              : t('userFeedback.rateOnPlayStore')
          }
          enableGradient
          gradientColors={gradients.btn}
          containerStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={onReview}
        />
      )}
    </KeyboardAwareScrollView>
  );
};
export default withTranslation()(
  connect(null, {
    setUserFeedback,
  })(UserFeedBackScreen),
);
