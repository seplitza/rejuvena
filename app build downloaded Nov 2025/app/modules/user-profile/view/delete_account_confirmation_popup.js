/**
 * Delete Account Confirmation Popup
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {View, Modal, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {Label, Button} from '@app/components';
import {deleteAccountPopupStyles as styles} from './styles';
import {deleteAccount} from '../slice';

class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  show = () => {
    this.setState({visible: true});
  };

  hide = () => {
    this.setState({visible: false});
  };

  _deleteAccount = () => {
    this.props.deleteAccount();
    this.hide();
  };

  render() {
    const {t} = this.props;
    const {visible} = this.state;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={this.hide}
        statusBarTranslucent>
        <View style={styles.container}>
          <Label style={styles.titleStyle}>
            {t('editProfilePage.accountDeletionWarning')}
          </Label>
          <Label style={styles.messageStyle}>
            {t('editProfilePage.deleteAccountWarningMessage')}
          </Label>
          <Button
            title={t('editProfilePage.delete')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this._deleteAccount}
          />
          <Label style={styles.noThankLabelStyle} onPress={this.hide}>
            {t('common.noThanks')}
          </Label>
        </View>

        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={styles.absoluteFill} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connect(null, {deleteAccount}, null, {
  forwardRef: true,
})(DeleteAccount);
