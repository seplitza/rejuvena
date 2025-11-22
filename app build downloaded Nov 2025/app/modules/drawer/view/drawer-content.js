/**
 * Drawer Content
 * @flow
 * @format
 */

import React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {connectStructuredSelector} from '@app/utils';
import {selectMyProfile} from '@app/modules/user-profile';
import {
  selectIsContestAvailable,
  selectCourseLanguage,
} from '@app/modules/exercise';
import {withTranslation} from '@app/translations';
import {LanguagePicker} from '@app/modules/shared';
import {logout, setNewUser, selectGuestUser} from '@app/modules/common';
import {
  Label,
  Container,
  CacheImage,
  NotificationIcon,
  Icon,
} from '@app/components';
import {ImageSource, Routes} from '@app/common';
import {styles} from './styles';

type Props = {
  navigation: any,
  logout: typeof logout,
  t: Function,
};

const DrawerContent = (props: Props) => {
  const {navigation, user, isContestAvailable, t, isGuestUser, courseLanguage} =
    props;

  const renderMenuItem = (name, iconName, onPress, extraContent) => {
    return (
      <TouchableOpacity
        delayPressIn={0}
        activeOpacity={0.5}
        style={styles.itemStyle}
        onPress={onPress}>
        <Icon
          type="MaterialCommunityIcons"
          name={iconName}
          style={styles.iconStyle}
        />
        <Label style={styles.labelStyle}>{name}</Label>
        {extraContent}
      </TouchableOpacity>
    );
  };

  const navigateToTermsAndConditions = () => {
    navigation.navigate(Routes.TermAndConditionScreen);
  };

  const navigateToPrivacyPolicy = () => {
    navigation.navigate(Routes.PrivacyPolicyScreen);
  };

  const demoPlaceholder =
    courseLanguage === 'ru' ? ImageSource.demoIconRu : ImageSource.demoIconEn;

  return (
    <Container>
      <CacheImage
        placeholderSource={
          isGuestUser ? demoPlaceholder : ImageSource.imagePlaceholder
        }
        source={{uri: user?.profilePicture}}
        style={styles.userImageStyle}
      />

      <LanguagePicker style={styles.languagePickerStyle} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {!isGuestUser &&
          renderMenuItem(
            t('drawer.personalInformation'),
            'account-outline',
            () => navigation.navigate(Routes.UserProfileScreen),
          )}
        {(isGuestUser || isContestAvailable) &&
          renderMenuItem(t('drawer.photoDiary'), 'camera-outline', () =>
            navigation.navigate(Routes.PhotoDiaryScreen),
          )}
        {!isGuestUser &&
          renderMenuItem(t('drawer.myOrders'), 'shopping-outline', () =>
            navigation.navigate(Routes.OrderListScreen),
          )}
        {renderMenuItem(
          t('drawer.inspirations'),
          'trophy-variant-outline',
          () => navigation.navigate(Routes.VotingScreen),
        )}
        {!isGuestUser &&
          renderMenuItem(
            t('drawer.notifications'),
            'bell-outline',
            () => navigation.navigate(Routes.NotificationScreen),
            <View style={styles.notificationIconStyle}>
              <NotificationIcon onlyIcon />
            </View>,
          )}
        {renderMenuItem(t('drawer.feedback'), 'message-alert-outline', () =>
          navigation.navigate(Routes.UserFeedBackScreen),
        )}
        {renderMenuItem(
          isGuestUser ? t('drawer.signup') : t('drawer.logout'),
          isGuestUser ? 'login' : 'logout',
          () => {
            setTimeout(() => navigation.closeDrawer(), 100);
            props.logout({showSingUpScreen: isGuestUser});
            props.setNewUser(false);
          },
        )}
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={navigateToTermsAndConditions}>
            <Label style={styles.termsLabelStyle}>
              {t('drawer.termsAndConditions')}
            </Label>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToPrivacyPolicy}>
            <Label style={styles.termsLabelStyle}>
              {t('drawer.privacyPolicy')}
            </Label>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = {
  user: selectMyProfile,
  isContestAvailable: selectIsContestAvailable,
  isGuestUser: selectGuestUser,
  courseLanguage: selectCourseLanguage,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {logout, setNewUser})(
    DrawerContent,
  ),
);
