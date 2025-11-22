/**
 * Contest Rules
 * @flow
 * @format
 */

import React from 'react';
import {View, ScrollView, Image, Platform} from 'react-native';
import {ImageSource} from '@app/common';
import {useTranslation} from '@app/translations';
import {connectStructuredSelector} from '@app/utils';
import {takePartInContest, acceptOrRejectTerms} from '../slice';
import {selectContest, selectIsTermsAccepted} from '../selectors';
import {Label, TouchableItem} from '@app/components';
import styles from './styles';

const Props = {
  loading: Boolean,
  takePartInContest: typeof takePartInContest,
  acceptOrRejectTerms: typeof acceptOrRejectTerms,
  contest: Object,
  termsAccepted: Boolean,
};

const ContestRules = (props: Props) => {
  const {t} = useTranslation();
  const {termsAccepted} = props;
  const {isContestParticipated} = props.contest || {};

  const renderParticipateButton = (label, active) => {
    return (
      <TouchableItem
        style={[
          styles.yesNoButtonStyle,
          !active && styles.yesNoButtonDisableStyle,
        ]}
        onPress={() => props.takePartInContest(!isContestParticipated)}
        disabled={active}>
        <>
          {active && (
            <Image source={ImageSource.check} style={styles.checkIconStyle} />
          )}
          <Label style={styles.yesNoLabel}>{label}</Label>
        </>
      </TouchableItem>
    );
  };

  return (
    <ScrollView
      nestedScrollEnabled={Platform.OS === 'ios' ? false : true}
      contentContainerStyle={styles.rulesContentContainer}>
      <Label style={[styles.ruleLabelStyle, styles.ruleLabelLarge]}>
        {t('photoDiaryPage.photoDiaryRules')}
      </Label>

      <Label style={[styles.ruleLabelStyle, styles.ruleLabelJustify]}>
        {t('photoDiaryPage.photoDiaryRulesDescription')}
      </Label>

      <View style={styles.yesNoButtonContainer}>
        {renderParticipateButton(
          t('photoDiaryPage.yes'),
          isContestParticipated,
        )}
        {renderParticipateButton(
          t('photoDiaryPage.no'),
          !isContestParticipated,
        )}
      </View>

      <Label style={[styles.ruleLabelStyle, styles.ruleLabelJustify]}>
        {t('photoDiaryPage.imagesForAd')}
      </Label>

      <View style={styles.checkBoxAgreeContainer}>
        <Label style={styles.ruleLabelStyle}>
          {t('photoDiaryPage.iAgreeWithTheRule')}
        </Label>
        <TouchableItem
          onPress={() => props.acceptOrRejectTerms(!termsAccepted)}>
          <Image
            source={
              termsAccepted
                ? ImageSource.termsChecked
                : ImageSource.termsUnChecked
            }
            style={styles.checkUnCheckIconStyle}
          />
        </TouchableItem>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = {
  contest: selectContest,
  termsAccepted: selectIsTermsAccepted,
};

export default connectStructuredSelector(mapStateToProps, {
  takePartInContest,
  acceptOrRejectTerms,
})(ContestRules);
