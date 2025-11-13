/**
 * Age Bot Popup
 * @flow
 * @format
 */
import React from 'react';
import {View, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {Label, Button} from '@app/components';
import {ImageSource} from '@app/common';
import {EStyleSheet, shadow} from '@app/styles';

type Props = {
  t: Function,
};

type State = {
  visible: Boolean,
  imageUrl: string,
};

class AgeBotPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible: false, age: null};
  }

  open = (age) => {
    this.setState({visible: true, age});
  };

  hide = () => {
    this.setState({visible: false});
  };

  render() {
    const {t} = this.props;
    const {visible, age} = this.state;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={this.hide}>
        <View style={styles.container}>
          <Image source={ImageSource.logoIcon} style={styles.avatar} />
          <Label style={styles.labelStyle}>
            {t('photoDiaryPage.ageByAgeBot')}
          </Label>
          <Label style={styles.userAgeStyle}>{age}</Label>
          <Label style={styles.labelStyle}>
            {t('photoDiaryPage.uploadMorePhoto')}
          </Label>
          <Button
            title={t('photoDiaryPage.close')}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonStyle}
            onPress={this.hide}
          />
        </View>
        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={styles.absoluteFill} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
export {AgeBotPopup};

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '340@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: '8@ms',
    borderRadius: '18@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
    ...shadow,
  },
  avatar: {
    width: '100@ms',
    height: 'auto',
    aspectRatio: 1,
    marginVertical: '20@ms',
    resizeMode: 'contain',
  },
  labelStyle: {
    color: 'rgb(0,25,107)',
    textAlign: 'center',
    fontSize: '22@ms',
  },
  userAgeStyle: {
    color: 'rgb(0,25,107)',
    textAlign: 'center',
    fontSize: '60@ms',
    marginVertical: '5@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    borderColor: '$colors.primary',
    borderRadius: '28@ms',
    borderWidth: '2@ms',
    ...shadow,
    elevation: 0,
    marginTop: '30@ms',
    marginBottom: '40@ms',
  },
  buttonTitle: {
    color: '$colors.primary',
    fontSize: '20@ms',
  },
});
