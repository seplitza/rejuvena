/**
 * Navigator: Auth Section
 * @flow
 * @format
 */

import React from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from '@app/translations';
import {Routes} from '@app/common';
import {NavigationHeader} from './navigation-header';
import {selectNewUser} from '@app/modules/common';
import {slideHorizontal} from './navigation-configs';
import {selectInitialRoute} from '@app/modules/common';

// Screens
import {
  LoginScreen,
  SignupScreen,
  SignupByEmailScreen,
  ForgotPasswordScreen,
  TermAndConditionScreen,
  PrivacyPolicyScreen,
} from '@app/modules/auth';
import {OnBoardingScreen} from '@app/modules/onboarding';

// Navigator instance
const Stack = createStackNavigator();

function AuthSection() {
  const {t} = useTranslation();
  const isNewUser = useSelector(selectNewUser);
  const initialRoute = useSelector(selectInitialRoute);

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <NavigationHeader {...props} />,
        cardStyleInterpolator: slideHorizontal,
      }}
      headerMode="screen"
      initialRouteName={initialRoute}>
      {isNewUser && (
        <Stack.Screen
          options={{headerShown: false}}
          name={Routes.OnBoardingScreen}
          component={OnBoardingScreen}
        />
      )}
      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.LoginScreen}
        component={LoginScreen}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.SignUpScreen}
        component={SignupScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.SignupByEmailScreen}
        component={SignupByEmailScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.ForgotPasswordScreen}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        options={{title: t('headers.termAndCondition')}}
        name={Routes.TermAndConditionScreen}
        component={TermAndConditionScreen}
      />
      <Stack.Screen
        options={{title: t('headers.privacyPolicy')}}
        name={Routes.PrivacyPolicyScreen}
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
}

export {AuthSection};
