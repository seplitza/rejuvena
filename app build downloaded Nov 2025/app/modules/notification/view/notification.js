/**
 * Notification Screen
 * @format
 */

import React from 'react';
import {
  View,
  Image,
  Pressable,
  RefreshControl,
  AppState,
  TouchableWithoutFeedback,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {withTranslation} from '@app/translations';
import {connectStructuredSelector, trackEvent} from '@app/utils';
import {getNotifications, markAsRead, deleteNotification} from '../slice';
import {selectIsGettingNotifications, selectNotifications} from '../selectors';
import {ImageSource} from '@app/common';
import {LoadingGate, Label, Header, Icon} from '@app/components';
import NotificationSetting from './notification-setting';
import {MessageComponent} from './message';
import {styles} from './styles';

type Props = {
  getNotifications: typeof getNotifications,
  markAsRead: typeof markAsRead,
  deleteNotification: typeof deleteNotification,
  loading: Boolean,
  notifications: Array<Object>,
};

class NotificationScreen extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {appState: 'active', isCollapsedSetting: true};
    this.notificationSettingRef = React.createRef();
  }

  componentDidMount() {
    trackEvent('View Notifications');
    this.getNotifications();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  getNotifications = () => {
    this.props.getNotifications();
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.getNotifications();
    }
    this.setState({appState: nextAppState});
  };

  componentWillUnmount() {
    this.getNotifications();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  _deleteNotification = (notificationId) => {
    this.props.deleteNotification(notificationId);
  };

  renderHiddenItem = (data) => {
    return (
      <Pressable
        style={[styles.notificationContainer, styles.deleteViewStyle]}
        onPress={() => this._deleteNotification(data?.item?.id)}>
        <Icon name="delete" type="MaterialIcons" style={styles.iconStyle} />
      </Pressable>
    );
  };

  renderItem = ({item}) => {
    return (
      <MessageComponent
        notification={item}
        i18n={this.props.i18n}
        markAsRead={this.props.markAsRead}
      />
    );
  };

  renderEmptyPlaceholder(t) {
    return (
      <View style={styles.emptyPlaceholderContainer}>
        <Image
          style={styles.notificationIconStyle}
          source={ImageSource.emptyNotificationPlaceholder}
        />

        <Label style={styles.noNotifLabelStyle}>
          {t('common.emptyNotificationMessage')}
        </Label>
      </View>
    );
  }

  visibleNotificationSetting = () => {
    const {isCollapsedSetting} = this.state;
    this.setState({isCollapsedSetting: !isCollapsedSetting});
    if (!isCollapsedSetting) {
      this.notificationSettingRef.current?.submitSetting();
    }
  };

  render() {
    const {loading, notifications, t} = this.props;
    const {isCollapsedSetting} = this.state;
    return (
      <>
        <Header
          title={t('drawer.notifications')}
          visibleNotificationSetting={this.visibleNotificationSetting}
          canGoBack
          showSettingIcon
        />
        <View style={styles.notificationSettingContainerStyles}>
          <NotificationSetting
            t={t}
            ref={this.notificationSettingRef}
            isCollapsed={isCollapsedSetting}
          />
        </View>
        <LoadingGate loading={loading}>
          <SwipeListView
            contentContainerStyle={styles.listContainerStyle}
            data={notifications}
            ListEmptyComponent={() => this.renderEmptyPlaceholder(t)}
            renderItem={this.renderItem}
            renderHiddenItem={(data) => this.renderHiddenItem(data)}
            rightOpenValue={styles._deleteButton.width}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this.getNotifications}
                colors={[styles.refreshControl.color]}
                tintColor={styles.refreshControl.color}
              />
            }
          />
        </LoadingGate>
        {!isCollapsedSetting && (
          <TouchableWithoutFeedback onPress={this.visibleNotificationSetting}>
            <View style={styles.absoluteFill} />
          </TouchableWithoutFeedback>
        )}
      </>
    );
  }
}

const mapStateToProps = {
  loading: selectIsGettingNotifications,
  notifications: selectNotifications,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    getNotifications,
    markAsRead,
    deleteNotification,
  })(NotificationScreen),
);
