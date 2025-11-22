/**
 * New Update Available Popup
 * @flow
 * @format
 */

import React from 'react';
import {View, Image, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {withTranslation} from '@app/translations';
import {Label} from '@app/components/label';
import {Button} from '@app/components';
import {ImageSource} from '@app/common';
import {styles} from './styles';

type Props = {
  mustUpdate: Boolean,
  onDismiss: Function,
  t: Function,
};

class UpdateAvailablePopup extends React.Component<Props> {
  update = async () => {
    const storeUrl = await VersionCheck.getStoreUrl({appID: '1558153613'});
    Linking.openURL(storeUrl); // Open store.
  };

  render() {
    const {mustUpdate, onDismiss, t} = this.props;

    return (
      <View style={styles.container}>
        <Image source={ImageSource.logoIcon} style={styles.logoStyle} />
        <Label style={styles.labelStyle}>
          {mustUpdate
            ? t('common.forceUpdateMessage')
            : t('common.recommendUpdateMessage')}
        </Label>
        <Button
          title={t('common.update')}
          containerStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          onPress={this.update}
        />
        {!mustUpdate && (
          <Button
            title={t('common.noThanks')}
            titleStyle={styles.titleStyle}
            containerStyle={styles.buttonStyle}
            onPress={onDismiss}
          />
        )}
      </View>
    );
  }
}

export const UpdateAvailable = withTranslation('', {})(UpdateAvailablePopup);
