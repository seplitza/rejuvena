/**
 * Navigator: Main Section
 * @flow
 * @format
 */

import React from 'react';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {selectInitialRoute, selectGuestUser} from '@app/modules/common';
import {Routes, ImageSource} from '@app/common';
import {EStyleSheet, moderateScale} from '@app/styles';
import {DrawerContent} from '@app/modules/drawer';
import {useTranslation} from '@app/translations';
import {Icon} from '@app/components';
import {NavigationHeader} from './navigation-header';
import {slideHorizontal} from './navigation-configs';

// Screens
import {OrderListScreen} from '@app/modules/order-list';
import {CourseDescriptionScreen} from '@app/modules/course-description';
import {
  ExerciseScreen,
  DescriptionCommentTabScreen,
  selectIsTabBarVisible,
} from '@app/modules/exercise';
import {NotificationScreen} from '@app/modules/notification';
import {
  PhotoDiaryScreen,
  CongratsScreen,
  ViewPDFScreen,
  VotingScreen,
  WinnersScreen,
} from '@app/modules/photo-diary';
import {UserProfileScreen} from '@app/modules/user-profile';
import {UserFeedBackScreen} from '@app/modules/user-feedback';

import {
  TermAndConditionScreen,
  PrivacyPolicyScreen,
  GuestUserScreen,
} from '@app/modules/auth';

// Navigator instance
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const activeColor = '#00259E';
const inactiveColor = 'rgba(0,37,158,.5)';
const screenOptions = {
  header: (props) => <NavigationHeader {...props} />,
  cardStyleInterpolator: slideHorizontal,
};

const VotingStack = createStackNavigator();
const VotingNavigator = () => {
  return (
    <VotingStack.Navigator screenOptions={screenOptions}>
      <VotingStack.Screen
        options={{headerShown: true}}
        name={Routes.WinnersScreen}
        component={WinnersScreen}
      />
      <VotingStack.Screen
        options={{headerShown: true}}
        name={Routes.VotingScreen}
        component={VotingScreen}
      />
    </VotingStack.Navigator>
  );
};

const PhotodiaryStack = createStackNavigator();
const PhotodiaryNavigator = () => {
  return (
    <PhotodiaryStack.Navigator screenOptions={screenOptions}>
      <PhotodiaryStack.Screen
        options={{headerShown: true}}
        name={Routes.PhotoDiaryScreen}
        component={PhotoDiaryScreen}
      />
      <PhotodiaryStack.Screen
        options={{headerShown: true}}
        name={Routes.ViewPDFScreen}
        component={ViewPDFScreen}
      />
      <PhotodiaryStack.Screen
        options={{headerShown: false}}
        name={Routes.CongratsScreen}
        component={CongratsScreen}
      />
    </PhotodiaryStack.Navigator>
  );
};

const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen
        options={{headerShown: true}}
        name={Routes.UserProfileScreen}
        component={UserProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

const ExerciseStack = createStackNavigator();
const ExerciseNavigator = () => {
  return (
    <ExerciseStack.Navigator screenOptions={screenOptions}>
      <ExerciseStack.Screen
        options={{headerShown: false, animationEnabled: false}}
        name={Routes.ExerciseScreen}
        component={ExerciseScreen}
      />
      <ExerciseStack.Screen
        options={({route}) => ({
          title: route?.params?.exercise?.exerciseName,
          animationEnabled: false,
        })}
        name={Routes.DescriptionCommentTabScreen}
        component={DescriptionCommentTabScreen}
      />
    </ExerciseStack.Navigator>
  );
};

const OrderStack = createStackNavigator();
const OrderNavigator = () => {
  return (
    <OrderStack.Navigator screenOptions={screenOptions}>
      <OrderStack.Screen
        options={{headerShown: true}}
        name={Routes.OrderListScreen}
        component={OrderListScreen}
      />
      <OrderStack.Screen
        options={{headerShown: true}}
        name={Routes.CourseDescriptionScreen}
        component={CourseDescriptionScreen}
      />
    </OrderStack.Navigator>
  );
};

const GuestUserStack = createStackNavigator();
const GuestUserNavigator = () => {
  return (
    <GuestUserStack.Navigator screenOptions={screenOptions}>
      <GuestUserStack.Screen
        options={{headerShown: false}}
        name={Routes.GuestUserScreen}
        component={GuestUserScreen}
      />
      <GuestUserStack.Screen
        options={{headerShown: true}}
        name={Routes.PhotoDiaryScreen}
        component={PhotoDiaryScreen}
      />
      <GuestUserStack.Screen
        options={{headerShown: false}}
        name={Routes.VotingScreen}
        component={VotingNavigator}
      />
      <GuestUserStack.Screen
        options={{headerShown: true}}
        name={Routes.CourseDescriptionScreen}
        component={CourseDescriptionScreen}
      />
    </GuestUserStack.Navigator>
  );
};

const getTabBarVisible = (route) => {
  const params = route.params;
  if (params) {
    if (params.tabBarVisible === false) {
      return false;
    }
  }
  return true;
};

function MainTabs() {
  const initialRoute = useSelector(selectInitialRoute);
  const isGuestUser = useSelector(selectGuestUser);
  const tabBarVisible = useSelector(selectIsTabBarVisible);
  const safeInsets = useSafeAreaInsets();
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {height: moderateScale(54 + safeInsets.bottom)},
        tabStyle: styles.tabStyle,
        labelStyle: styles.tabLabelStyle,
        activeTintColor: activeColor,
        inactiveTintColor: inactiveColor,
        keyboardHidesTabBar: true,
        labelPosition: 'below-icon',
      }}
      initialRouteName={initialRoute}>
      {!isGuestUser && (
        <Tab.Screen
          name={Routes.OrderListScreen}
          component={OrderNavigator}
          options={({route}) => ({
            tabBarVisible: getTabBarVisible(route) && tabBarVisible,
            tabBarLabel: t('drawer.myOrders'),
            tabBarIcon: ({focused}) => (
              <TabBarIcon focused={focused} iconName={'shopping-outline'} />
            ),
          })}
        />
      )}
      <Tab.Screen
        name={Routes.VotingScreen}
        component={VotingNavigator}
        options={{
          tabBarVisible,
          tabBarLabel: t('drawer.challenge'),
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused} iconName={'trophy-variant-outline'} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.ExerciseScreen}
        component={ExerciseNavigator}
        options={({route}) => ({
          tabBarVisible: getTabBarVisible(route) && tabBarVisible,
          tabBarLabel: '',
          tabBarIcon: () => (
            <Image
              style={styles.centerTabBarImageStyle}
              source={ImageSource.logoIcon}
              resizeMode="contain"
            />
          ),
        })}
      />
      <Tab.Screen
        name={Routes.PhotoDiaryScreen}
        component={PhotodiaryNavigator}
        options={({route}) => ({
          tabBarVisible: getTabBarVisible(route) && tabBarVisible,
          tabBarLabel: t('drawer.photoDiary'),
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused} iconName={'camera-outline'} />
          ),
        })}
      />

      {!isGuestUser && (
        <Tab.Screen
          name={Routes.UserProfileScreen}
          component={ProfileNavigator}
          options={{
            tabBarVisible,
            tabBarLabel: t('drawer.personal'),
            tabBarIcon: ({focused}) => (
              <TabBarIcon focused={focused} iconName={'account-outline'} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const TabBarIcon = (props) => {
  const {iconName, focused} = props;
  return (
    <Icon
      type="MaterialCommunityIcons"
      name={iconName}
      style={[styles.iconStyle, {color: focused ? activeColor : inactiveColor}]}
    />
  );
};

function MainStack() {
  const {t} = useTranslation();
  const initialRoute = useSelector(selectInitialRoute);

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={initialRoute}
      headerMode="screen">
      <Stack.Screen
        options={{headerShown: false}}
        name={'tabs'}
        component={MainTabs}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.GuestUserScreen}
        component={GuestUserNavigator}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={Routes.NotificationScreen}
        component={NotificationScreen}
      />
      <Stack.Screen
        options={{headerShown: true}}
        name={Routes.UserFeedBackScreen}
        component={UserFeedBackScreen}
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

function MainSection() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerPosition="right"
      openByDefault={false}
      drawerStyle={styles.drawerStyle}>
      <Drawer.Screen name="drawer" component={MainStack} />
    </Drawer.Navigator>
  );
}

const styles = EStyleSheet.create({
  drawerStyle: {
    width: 'auto',
    minWidth: '250@ms',
  },
  tabStyle: {
    borderColor: '$colors.primary',
    borderTopWidth: 1,
  },
  centerTabBarImageStyle: {
    width: '35@ms',
    height: '35@ms',
    top: '25%',
    position: 'absolute',
  },
  iconStyle: {
    fontSize: '25@ms',
  },
  tabLabelStyle: {
    fontSize: '12@ms',
    fontFamily: '$fonts.DINLight',
    marginBottom: '6@ms',
  },
});

export {MainSection};
