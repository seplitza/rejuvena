/**
 * Registration By Email Screen
 * @flow
 * @format
 */

import React from 'react';
import {Keyboard, View} from 'react-native';
import {connect} from 'react-redux';
import {withTranslation} from '@app/translations';
import {Label, Input, Button, Form} from '@app/components';
import {AuthContainer} from './auth-container';
import {styles} from './styles';
import {signupSchema} from '../validator';
import {signupWithEmail} from '../slice';

// TODO: Define proper navigation type
type Props = {
  navigation: any,
};

const SignupByEmail = (props: Props) => {
  const {t} = props;
  const [activeStepper, setActiveStepper] = React.useState(0);
  const [stepperWidth, setStepperWidth] = React.useState(0);
  const [form, setForm] = React.useState({
    firstName: undefined,
    lastName: undefined,
  });

  const signup = (values) => {
    Keyboard.dismiss();
    props.signupWithEmail({...form, ...values});
  };

  const getWidth = () => {
    return stepperWidth * activeStepper;
  };

  const onChangeInput = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const getCaption = () => {
    return activeStepper === 0
      ? t('authPage.welcomeToJoinCaption')
      : activeStepper === 1
      ? t('authPage.subscribeLYCourseCaption')
      : t('authPage.sendPasswordCaption');
  };

  const getQuestion = () => {
    return activeStepper === 0
      ? t('authPage.whatsYourName')
      : activeStepper === 1
      ? t('authPage.whatsYourSurname')
      : t('authPage.whatsYourEmail');
  };

  const getStepperWidth = (event) => {
    const {width} = event?.nativeEvent.layout;
    setStepperWidth(width / 3);
  };

  const goToFistStep = () => {
    if (form?.firstName) {
      setActiveStepper(1);
    }
  };

  const goToSecondStep = () => {
    if (form?.lastName) {
      setActiveStepper(2);
    }
  };

  return (
    <AuthContainer
      showLanguagePicker
      title={t('authPage.join')}
      hideHeadingCaption={true}>
      <Label style={styles.caption}>{getCaption()}</Label>
      <View style={styles.stepperStyle} onLayout={getStepperWidth}>
        <View style={[styles.stepperFillStyle, {width: getWidth()}]} />
      </View>
      <Label style={styles.caption}>{getQuestion()}</Label>
      {activeStepper === 0 && (
        <>
          <Input
            placeholder={t('authPage.firstNamePlaceholder')}
            blurOnSubmit={false}
            autoCapitalize="words"
            value={form?.firstName}
            onChangeText={(value) => onChangeInput('firstName', value)}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={goToFistStep}
          />
          <Button
            title={t('authPage.continue')}
            disabled={!form?.firstName}
            onPress={() => setActiveStepper(1)}
            containerStyle={styles.buttonContainerStyle}
          />
        </>
      )}
      {activeStepper === 1 && (
        <>
          <Input
            placeholder={t('authPage.lastNamePlaceholder')}
            blurOnSubmit={false}
            autoCapitalize="words"
            value={form?.lastName}
            onChangeText={(value) => onChangeInput('lastName', value)}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={goToSecondStep}
          />
          <Button
            title={t('authPage.continue')}
            disabled={!form?.lastName}
            onPress={() => setActiveStepper(2)}
            containerStyle={styles.buttonContainerStyle}
          />
        </>
      )}
      {activeStepper === 2 && (
        <Form validationSchema={signupSchema} handleSubmit={signup}>
          <Input
            name="email"
            placeholder={t('authPage.email')}
            type={'Input'}
            autoFocus
            keyboardType="email-address"
          />
          <Button
            title={t('authPage.submit')}
            type={'Submit'}
            containerStyle={styles.buttonContainerStyle}
          />
        </Form>
      )}
    </AuthContainer>
  );
};

export default withTranslation()(
  connect(null, {
    signupWithEmail,
  })(SignupByEmail),
);
