/**
 * Notification icon with popover
 * @flow
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {View, Pressable} from 'react-native';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import LottieView from 'lottie-react-native';
import {
  connectStructuredSelector,
  NavigationService,
  removeHtmlTags,
} from '@app/utils';
import {withTranslation} from '@app/translations';
import {selectNotifications} from '@app/modules/notification';
import {Routes} from '@app/common';
import {Label} from '@app/components/label';
import {styles} from './styles';

const NotificationIconComp = (props: Props) => {
  const {notifications, onlyIcon, onNotificationCount, t} = props;
  const [popoverVisible, setPopoverVisible] = useState(false);
  const animationRef = useRef(null);

  const topNotifications = notifications
    ?.filter((notification) => notification.isNew)
    .slice(0, 7);

  useEffect(() => {
    onNotificationCount?.(topNotifications.length !== 0);
  }, [topNotifications.length]);

  if (!topNotifications.length) {
    return null;
  }

  const show = () => {
    setPopoverVisible(true);
    animationRef?.current.reset();
    animationRef?.current.pause();
  };

  const hide = () => {
    setPopoverVisible(false);
    animationRef?.current.play();
  };

  const notificationIcon = (
    <Pressable onPress={show}>
      <>
        <LottieView
          ref={animationRef}
          autoPlay={true}
          source={require('@app/assets/animation/bell.json')}
          style={styles.notificationIconStyle}
        />
        <View style={styles.countContainer}>
          <Label style={styles.notificationCount}>
            {topNotifications.length}
          </Label>
        </View>
      </>
    </Pressable>
  );

  if (onlyIcon) {
    return notificationIcon;
  }

  return (
    <Popover
      isVisible={popoverVisible}
      from={notificationIcon}
      popoverStyle={styles.popoverStyle}
      backgroundStyle={styles.backgroundStyle}
      placement={PopoverPlacement.BOTTOM}
      statusBarTranslucent
      onRequestClose={hide}>
      <View style={styles.contentContainer}>
        {topNotifications.map((notification, index) => (
          <Label
            key={index + notification}
            style={styles.notificationLabelStyle}>
            {`${index + 1}. ${removeHtmlTags(notification?.title)} `}
            <Label
              style={[styles.notificationLabelStyle, styles.checkLabelStyle]}
              onPress={() => {
                hide();
                NavigationService.navigate(Routes.NotificationScreen);
              }}>
              {t('common.check')}
            </Label>
          </Label>
        ))}
      </View>
    </Popover>
  );
};

const mapStateToProps = {
  notifications: selectNotifications,
};

export const NotificationIcon = withTranslation()(
  connectStructuredSelector(mapStateToProps)(NotificationIconComp),
);
