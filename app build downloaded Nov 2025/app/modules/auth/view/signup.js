/**
 * Signup Screen
 * @flow
 * @format
 */

import React from 'react';
import {View, Platform} from 'react-native';
import {connect} from 'react-redux';
import Apple from '@invertase/react-native-apple-authentication';
import {withTranslation} from '@app/translations';
import {Label, Button} from '@app/components';
import {ImageSource, Routes} from '@app/common';
import {AuthContainer} from './auth-container';
import {styles} from './styles';
import {signInWithGoogle, signInWithFacebook, signInWithApple} from '../slice';

// TODO: Define proper navigation type
type Props = {
  navigation: any,
};

const Signup = (props: Props) => {
  const {navigation, t} = props;

  const navigateToLogin = () => {
    navigation.navigate(Routes.LoginScreen);
  };

  const _signInWithGoogle = () => {
    props.signInWithGoogle();
  };

  const _signInWithFacebook = () => {
    props.signInWithFacebook();
  };

  const _signInWithApple = () => {
    props.signInWithApple();
  };

  const navigateToTermsAndConditions = () => {
    navigation.navigate(Routes.TermAndConditionScreen);
  };

  const navigateToPrivacyPolicy = () => {
    navigation.navigate(Routes.PrivacyPolicyScreen);
  };

  const navigateToSignupByEmail = () => {
    navigation.navigate(Routes.SignupByEmailScreen);
  };

  return (
    <AuthContainer showLanguagePicker title={t('authPage.join')}>
      <Button
        title={t('authPage.continueWithEmail')}
        onPress={navigateToSignupByEmail}
      />
      <Label style={styles.orSignInWithLabel}>
        {t('authPage.orSignInWith')}
      </Label>
      <View style={styles.socialSignInButtonContainer}>
        <Button
          source={ImageSource.google}
          onPress={_signInWithGoogle}
          containerStyle={styles.socialSignInButtonStyle}
        />
        <Button
          source={ImageSource.facebook}
          onPress={_signInWithFacebook}
          containerStyle={styles.socialSignInButtonStyle}
        />
        {Apple.isSupported && Platform.OS === 'ios' && (
          <Button
            source={ImageSource.apple}
            onPress={_signInWithApple}
            containerStyle={styles.socialSignInButtonStyle}
          />
        )}
      </View>
      <View style={styles.termsAndConditionsContainerStyle}>
        <Label style={styles.termsAndPrivacyTextStyle}>
          {`${t('authPage.agreeWith')}\n`}
          <Label
            style={[
              styles.termsAndPrivacyTextStyle,
              styles.termsAndPrivacyUnderline,
            ]}
            onPress={navigateToTermsAndConditions}>
            {t('authPage.termsAndConditions')}
          </Label>{' '}
          {t('authPage.and')}{' '}
          <Label
            style={[
              styles.termsAndPrivacyTextStyle,
              styles.termsAndPrivacyUnderline,
            ]}
            onPress={navigateToPrivacyPolicy}>
            {t('authPage.privacyPolicy')}
          </Label>
        </Label>
      </View>

      <Label style={[styles.label]}>
        {t('authPage.alreadyAccount')}
        <Label
          onPress={navigateToLogin}
          style={[styles.label, styles.termsAndPrivacyUnderline]}>
          {t('authPage.login')}
        </Label>
      </Label>
    </AuthContainer>
  );
};

export default withTranslation()(
  connect(null, {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
  })(Signup),
);
