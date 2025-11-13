/**
 * Contest Rules
 * @flow
 * @format
 */

import React from 'react';
import {Platform, ScrollView} from 'react-native';
import {useTranslation} from '@app/translations';
import {Label} from '@app/components';
import styles from './styles';

const Rules = () => {
  const {t} = useTranslation();
  return (
    <ScrollView
      nestedScrollEnabled={Platform.OS === 'ios' ? false : true}
      contentContainerStyle={styles.rulesContentContainer}
      hideVerticalScrollBar={true}>
      <Label style={styles.ruleOfContestStyles}>
        {t('inspirations.ruleOfContest')}
      </Label>
      <Label style={styles.contestRulesStyles}>
        {t('inspirations.contestRules')}
      </Label>
    </ScrollView>
  );
};

export {Rules};
