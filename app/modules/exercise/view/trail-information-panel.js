/**
 * Trail Information Panel
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import dayjs from 'dayjs';
import ActionSheet from 'react-native-actions-sheet';
import {useTranslation} from '@app/translations';
import {Label} from '@app/components';
import {styles} from './styles';

const Props = {
  title: String,
};

const TrailInformationPanel = (props: Props) => {
  const {t} = useTranslation();
  const {title, isDemoCourse} = props;
  const firstPaymentDate = dayjs().add(3, 'day').format('YYYY-MM-DD');
  const actionSheetRef = React.useRef<ActionSheet>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => actionSheetRef.current?.show(), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ActionSheet
      headerAlwaysVisible={true}
      gestureEnabled={true}
      ref={actionSheetRef}>
      <View style={styles.panelContainer}>
        {isDemoCourse ? (
          <Label style={styles.subscribeMessageTextStyle}>
            {t('marathonStartPage.demoCourseMessage')}
          </Label>
        ) : (
          <Label style={styles.subscribeMessageTextStyle}>
            {t('marathonStartPage.trailMessage', {
              title,
              date: firstPaymentDate,
            })}
          </Label>
        )}
        <Label style={styles.goodLuckTextStyle}>
          {t('marathonStartPage.goodLuck')}
        </Label>
      </View>
    </ActionSheet>
  );
};

export default TrailInformationPanel;
