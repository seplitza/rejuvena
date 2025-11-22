/**
 * Language Picker
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from '@app/translations';
import {capitalize} from '@app/utils';
import {changeLanguage} from '@app/modules/common';
import {Label, TouchableItem} from '@app/components';
import {EStyleSheet} from '@app/styles';

type Props = {
  style: any,
};

const LanguagePicker = (props: Props) => {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();

  const {style} = props;

  const updateLanguage = (language) => {
    dispatch(changeLanguage(language));
  };

  const localeKeys = Object.keys(i18n.store.data);
  const selectedLanguage = i18n.languages[0];

  return (
    <View style={[styles.container, style]}>
      {[...localeKeys.slice(1), localeKeys[0]].map((locale) => (
        <TouchableItem
          key={locale}
          onPress={() => updateLanguage(locale)}
          style={[
            styles.circleStyle,
            locale === selectedLanguage && styles.activeCircleStyle,
          ]}>
          <Label style={styles.labelStyle}>{capitalize(locale)}</Label>
        </TouchableItem>
      ))}
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  circleStyle: {
    height: '30@ms',
    width: '30@ms',
    borderRadius: '15@ms',
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3@ms',
    overflow: 'hidden',
  },
  activeCircleStyle: {
    backgroundColor: '$colors.primary',
    borderColor: '$colors.primary',
  },
  labelStyle: {
    fontSize: '15@ms',
  },
});

export {LanguagePicker};
