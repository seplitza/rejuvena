/**
 * Exercise Header
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import dayjs from 'dayjs';
import {connectStructuredSelector} from '@app/utils';
import {withTranslation} from '@app/translations';
import {ImageSource} from '@app/common';
import LinearGradient from 'react-native-linear-gradient';
import {Label, CacheImage} from '@app/components';
import {selectMyProfile} from '@app/modules/user-profile';
import {
  selectMarathon,
  selectSelectedDay,
  selectDemoCourse,
} from '../selectors';
import {gradients} from '@app/styles';
import {headerStyles as styles} from './styles';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const startDateInputFormat = 'M/D/YYYY';

type Props = {
  marathon: Object,
  user: Object,
  selectedDay: Object,
};
class ExerciseHeader extends React.Component<Props> {
  isNumber(day) {
    return typeof day === 'number';
  }
  getTitle(productTitle) {
    const {t, isDemoCourse} = this.props;
    return productTitle === 'study' || productTitle === 'обучение'
      ? t('marathonStartPage.study')
      : isDemoCourse
      ? t('marathonStartPage.demo')
      : t('marathonStartPage.practice');
  }

  shouldShowDayLabel() {
    const {selectedDay} = this.props;
    const {day} = selectedDay;

    return typeof day === 'number';
  }

  render() {
    const {marathon, user, selectedDay, t} = this.props;
    const {startDate, title} = marathon || {};
    const {productTitle, day, date, start} = selectedDay;
    const shouldShowDate = start ? startDate : date;
    return (
      <View style={styles.container}>
        <LinearGradient
          locations={[0, 0.06, 0.94, 1]}
          colors={gradients.heading}
          style={styles.absoluteFill}
        />
        <View style={styles.leftContent}>
          {start && (
            <Label numberOfLines={1} style={styles.productNameStyle}>
              {title}
            </Label>
          )}
          {!start && (
            <>
              <Label style={styles.dayLabelStyle}>
                {t('marathonStartPage.dayTitle')}
              </Label>
              <Label style={styles.dayValueStyle}>{day}</Label>
              {!!productTitle && (
                <Label numberOfLines={1} style={styles.dayLabelStyle}>
                  {this.getTitle(productTitle)}
                </Label>
              )}
            </>
          )}
        </View>
        {start && (
          <Label numberOfLines={1} style={styles.titleLabelStyle}>
            {t('marathonStartPage.start')}
          </Label>
        )}
        <View style={styles.rightContent}>
          <CacheImage
            placeholderSource={ImageSource.user}
            source={{uri: user?.profilePicture}}
            style={styles.userImageStyle}
          />
          <Label style={styles.dateStyle}>
            {shouldShowDate &&
              t('common.formatDate', {
                value: dayjs(start ? startDate : date, startDateInputFormat),
                format: 'DD MMMM ‘YY',
              })}
          </Label>
        </View>
      </View>
    );
  }
}

const mapStateToProps = {
  marathon: selectMarathon,
  user: selectMyProfile,
  selectedDay: selectSelectedDay,
  isDemoCourse: selectDemoCourse,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps)(ExerciseHeader),
);
