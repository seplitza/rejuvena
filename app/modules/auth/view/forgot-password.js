/**
 * Forgot Password Screen
 * @flow
 * @format
 */

import React from 'react';
import {Keyboard, View} from 'react-native';
import {connect} from 'react-redux';
import {withTranslation} from '@app/translations';
import {Label, Input, Button, Form} from '@app/components';
import {Routes} from '@app/common';
import {styles} from './styles';
import {AuthContainer} from './auth-container';
import {forgotPasswordSchema} from '../validator';
import {sendResetPasswordRequest} from '../slice';

// TODO: Define proper navigation type
type Props = {
  navigation: any,
  t: Function,
};

const ForgotPassword = (props: Props) => {
  const {navigation, route, t} = props;

  const navigateToLogin = () => {
    navigation.navigate(Routes.LoginScreen);
  };

  const submitResetPasswordRequest = (values) => {
    Keyboard.dismiss();
    props.sendResetPasswordRequest(values);
  };

  return (
    <AuthContainer showLanguagePicker title={t('authPage.passwordReset')}>
      <Form
        validationSchema={forgotPasswordSchema}
        handleSubmit={submitResetPasswordRequest}>
        <Input
          name="email"
          placeholder={t('authPage.emailPlaceholder')}
          value={route.params?.email}
          type={'Input'}
          keyboardType="email-address"
        />
        <Label style={[styles.label, styles.paddingVertical]}>
          {t('authPage.passwordSentToEmailAddressMessage')}
        </Label>
        <Button title={t('authPage.send')} type={'Submit'} />
        <View style={styles.sizeBox} />
        <Label
          style={[styles.label, styles.termsAndPrivacyUnderline]}
          onPress={navigateToLogin}>
          {t('authPage.login')}
        </Label>
      </Form>
    </AuthContainer>
  );
};

export default withTranslation()(
  connect(null, {sendResetPasswordRequest})(ForgotPassword),
);
