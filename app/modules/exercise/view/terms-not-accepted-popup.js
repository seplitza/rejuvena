/**
 * Terms Not Accepted Popup
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {useTranslation} from '@app/translations';
import {Label} from '@app/components';
import {styles} from './styles';

const TermsNotAcceptedPopup = (props: Props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.termsNotAcceptedContainer}>
      <Label style={styles.termsNotAcceptedMessageStyle}>
        {t('marathonStartPage.allFunctionWillAvailable')}
      </Label>
    </View>
  );
};

export default TermsNotAcceptedPopup;
