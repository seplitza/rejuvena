/**
 * Login Screen
 * @flow
 * @format
 */

import React, {useRef} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {connect} from 'react-redux';
import Apple from '@invertase/react-native-apple-authentication';
import {withTranslation} from '@app/translations';
import {Label, Input, Button, Form} from '@app/components';
import {ImageSource, Routes} from '@app/common';
import {styles} from './styles';
import {AuthContainer} from './auth-container';
import {loginFormSchema} from '../validator';
import {
  loginWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  guestUserLogin,
} from '../slice';

// TODO: Define proper navigation type
type Props = {
  navigation: any,
};

const Login = (props: Props) => {
  const formRef = useRef(null);
  const {navigation, route, t} = props;
  const navigateToForgotPassword = () => {
    navigation.navigate(Routes.ForgotPasswordScreen, {
      email: formRef.current?.getValues().email,
    });
  };

  const navigateToSignup = () => {
    navigation.navigate(Routes.SignUpScreen);
  };

  const login = (values) => {
    Keyboard.dismiss();
    props.loginWithEmail(values);
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

  return (
    <AuthContainer showLanguagePicker title={t('authPage.login')}>
      <Form
        validationSchema={loginFormSchema}
        ref={formRef}
        handleSubmit={login}>
        <Input
          name="email"
          placeholder={t('authPage.email')}
          value={route.params?.email}
          type="Input"
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="email-address"
        />
        <Input
          name="password"
          placeholder={t('authPage.passwordPlaceholder')}
          secureTextEntry
          type="Input"
        />
        <Label
          style={[styles.label, styles.underline]}
          onPress={navigateToForgotPassword}>
          {t('authPage.forgotPasswordTitle')}
        </Label>
        <Button title={t('authPage.login')} type="Submit" />
      </Form>
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
      <View style={styles.sizeBox} />
      <Label style={styles.label}>
        {t('authPage.newHere')}
        <Label
          style={[styles.label, styles.termsAndPrivacyUnderline]}
          onPress={navigateToSignup}>
          {t('authPage.joinButtonTitle')}
        </Label>
      </Label>
    </AuthContainer>
  );
};

export default withTranslation()(
  connect(null, {
    loginWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    guestUserLogin,
  })(Login),
);
