/**
 * Image Confirmation Popup
 * @flow
 * @format
 */

import React from 'react';
import {View, Modal} from 'react-native';
import {Label, CacheImage} from '@app/components';
import styles from './styles';

type Props = {
  onConfirm: Function,
};
type State = {
  visible: Boolean,
  imageUrl: string,
};

class ImageConfirmationPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible: false, imageUrl: null};
  }

  open = (imageUrl) => {
    this.setState({visible: true, imageUrl});
  };

  hide = () => {
    this.setState({visible: false});
  };

  onConfirm = () => {
    this.hide();
    setTimeout(() => {
      this.props.onConfirm?.();
    }, 500);
  };

  render() {
    const {visible, imageUrl} = this.state;
    const {t} = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={visible}
        onRequestClose={this.hide}>
        <View style={styles.imagePopupContainer}>
          <CacheImage
            loaderShown
            loaderProps={{color: '#555', size: 'large'}}
            source={{uri: imageUrl}}
            style={styles.confirmationImageStyle}
          />
          <View style={styles.retakeOkButtonContainer}>
            <Label style={styles.retakeOkButtonTitle} onPress={this.hide}>
              {t('common.cancel')}
            </Label>
            <Label style={styles.retakeOkButtonTitle} onPress={this.onConfirm}>
              {t('common.ok')}
            </Label>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ImageConfirmationPopup;
