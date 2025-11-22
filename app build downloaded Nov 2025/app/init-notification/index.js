/**
 * Initial Notifications
 * @flow
 * @format
 */

import React from 'react';
import {connect} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import * as Config from '@app/config';
import {setPlayerId} from '@app/modules/common';
import {NavigationService} from '@app/utils';
import {Routes} from '@app/common';
import {getNotifications} from '@app/modules/notification';

class Notification extends React.Component {
  async componentDidMount() {
    try {
      /* O N E S I G N A L   S E T U P */
      OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID);
      OneSignal.setLogLevel(6, 0);
      OneSignal.setRequiresUserPrivacyConsent(false);

      OneSignal.promptForPushNotificationsWithUserResponse(() => {});

      /* O N E S I G N A L  H A N D L E R S */
      OneSignal.setNotificationWillShowInForegroundHandler(
        (notifReceivedEvent) => {
          const notification = notifReceivedEvent.getNotification();
          setTimeout(() => notifReceivedEvent.complete(notification), 0);
          this.props.getNotifications();
        },
      );
      OneSignal.setNotificationOpenedHandler((notification) => {
        console.log('OneSignal: notification opened:', notification);
        const {additionalData} = notification?.notification;
        if (additionalData?.notification_type === 'automated') {
          NavigationService.navigate(Routes.ExerciseScreen);
          return;
        }
        NavigationService.navigate(Routes.NotificationScreen);
      });
      OneSignal.addSubscriptionObserver((event) => {
        this.OSLog('OneSignal: subscription changed:', event);
      });
      OneSignal.addPermissionObserver((event) => {
        this.OSLog('OneSignal: permission changed:', event);
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    OneSignal.clearHandlers();
  }

  OSLog = (title, response) => {
    const {userId} = response?.to;
    userId && this.props.setPlayerId(userId);
  };

  render() {
    return null;
  }
}

export default connect(null, {setPlayerId, getNotifications})(Notification);
