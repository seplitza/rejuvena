/**
 * Set Permission
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal, TouchableWithoutFeedback, Linking} from 'react-native';
import {Label, Button, Icon} from '@app/components';
import {withTranslation} from '@app/translations';
import {styles} from './styles';

type Props = {
  message: String,
  title: String,
  t: Function,
};

type State = {
  visible: boolean,
};

class PermissionPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible: false, isItForAfter: false};
  }

  show = (isItForCamera) => {
    this.setState({visible: true, isItForCamera});
  };

  hide = () => {
    this.setState({visible: false});
  };

  openSetting = async () => {
    await Linking.openSettings();
    this.setState({visible: false});
  };

  render() {
    const {visible, isItForCamera} = this.state;
    const {title, message, t} = this.props;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        statusBarTranslucent>
        <View style={styles.container}>
          {isItForCamera ? (
            <View style={styles.iconContainer}>
              <Icon
                type="MaterialIcons"
                name="camera-alt"
                style={styles.iconStyle}
              />
              <Icon type="Entypo" name="plus" style={styles.iconStyle} />
              <Icon
                type="MaterialIcons"
                name="perm-media"
                style={styles.iconStyle}
              />
            </View>
          ) : (
            <Icon
              type="MaterialIcons"
              name="perm-media"
              style={styles.iconStyle}
            />
          )}

          <Label style={styles.titleStyle}>
            {!!title ? title : t('common.blockedTitle')}
          </Label>
          <Label style={styles.messageStyle}>
            {!!message
              ? message
              : isItForCamera
              ? t('common.blockedMessage')
              : t('common.blockedPhotoMessage')}
          </Label>
          <Button
            containerStyle={styles.buttonStyle}
            title={t('common.openSetting')}
            onPress={this.openSetting}
          />
        </View>

        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={styles.absoluteFill} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export const SetPermission = withTranslation('', {withRef: true})(
  PermissionPopup,
);
