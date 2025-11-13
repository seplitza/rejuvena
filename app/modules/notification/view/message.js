/**
 * Message Component
 * @format
 */

import React from 'react';
import {Pressable} from 'react-native';
import dayjs from 'dayjs';
import {removeHtmlTags} from '@app/utils';
import {Label, Icon, CacheImage} from '@app/components';
import {styles} from './styles';

type Props = {
  saveNotification: typeof saveNotification,
  notification: Object,
};
class MessageComponent extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }

  componentDidMount() {
    if (this.props.notification?.isNew) {
      this.props.markAsRead(this.props.notification?.id);
    }
  }

  setActive = () => {
    this.setState({active: !this.state.active});
  };

  render() {
    const {active} = this.state;
    const {notification, i18n} = this.props;
    const {title, message, createdDate, isNew, imageURL, reply} = notification;
    const isReplyMessage = removeHtmlTags(message);
    const isReplyName = removeHtmlTags(title);
    return (
      <Pressable
        onPress={this.setActive}
        style={[
          styles.notificationContainer,
          !isNew && styles.notificationContainerOld,
        ]}>
        <>
          <Icon
            type="Ionicons"
            name={active ? 'chevron-up' : 'chevron-down'}
            style={styles.arrowIconStyle}
          />
          <Label
            numberOfLines={active ? undefined : 1}
            style={styles.notificationTitleStyle}>
            {!reply ? title : isReplyName}
          </Label>
          <Label
            numberOfLines={active ? undefined : 1}
            style={styles.notificationMsgStyle}>
            {!reply ? message : isReplyMessage}
          </Label>
          {!!imageURL && active && (
            <CacheImage
              source={{uri: imageURL}}
              style={styles.notificationImage}
              loaderShown
            />
          )}
          <Label style={styles.notificationTimeStyle}>
            {dayjs(createdDate).locale(i18n.language).fromNow()}
          </Label>
        </>
      </Pressable>
    );
  }
}

export {MessageComponent};
