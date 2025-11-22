/**
 * Exercise Days
 * @flow
 * @format
 */

import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import dayjs from 'dayjs';
import Popover from 'react-native-popover-view';
import {
  connectStructuredSelector,
  addDaySuffix,
  ratingChecker,
  trackEvent,
  countWeekRating,
} from '@app/utils';
import {withTranslation, getLanguage} from '@app/translations';
import {selectShouldShowTooltip, setTooltip} from '@app/modules/common';
import {
  selectMarathon,
  selectSelectedDay,
  selectDemoCourse,
  selectIsTermsAccepted,
  selectDayStar,
} from '../selectors';
import {
  setSelectedDay,
  getDayExercise,
  activeExerciseId,
  updateDayStarValue,
} from '../slice';
import {Routes} from '@app/common';
import {ImageSource} from '@app/common';
import {TouchableItem, Label, Rating} from '@app/components';
import {marathonDaysStyle as styles} from './styles';
import GetStarCongratulationPopup from './get-star-congrats-popup';

type Props = {
  onPressDay: Function,
  marathon: Object,
  navigation: any,
};

class MarathonDays extends React.Component<Props> {
  currentDayDetails = null;
  selectedDayDetails = null;
  tabPressListener = null;
  constructor(props) {
    super(props);
    this.popoverRef = React.createRef();
    this.state = {};
  }
  componentDidMount() {
    const {marathon, shouldShowStartPage, t} = this.props;
    this.tabPressListener = this.props.navigation
      .dangerouslyGetParent()
      .addListener('tabPress', (e) => {
        if (
          e?.target?.includes(Routes.ExerciseScreen) &&
          this.props.navigation.isFocused()
        ) {
          this.props.refresh();
        }
      });
    // On first time arrive on exercise screen after payment need to show start (welcome message) of marathon
    if (shouldShowStartPage) {
      const {id, welcomeMessage} = marathon?.welcomeMessage || {};
      const details = {
        id,
        day: t('marathonStartPage.start'),
        description: welcomeMessage,
        start: true,
      };
      this.onPressDay(details);
      return;
    }

    this.onPressDay(this.currentDayDetails);
  }

  componentWillUnmount() {
    this.tabPressListener?.();
  }

  // Parent component will call to refresh data
  refresh() {
    this.onPressDay(this.selectedDayDetails);
  }

  onPressDay(details) {
    this.selectedDayDetails = details;
    const {marathonId} = this.props.marathon || {};
    /*
      Sometime scroll to top not working properly due to
      content in changing state. adding some delay to wait
      content changing so that scroll to top work properly.
    */
    setTimeout(() => this.props.onPressDay(), 100);

    const isDay = typeof details.day === 'number';
    if (isDay) {
      this.props.activeExerciseId({exerciseId: null});
      this.props.getDayExercise({
        dayId: details.id,
        marathonId,
        productTitle: details.productTitle,
      });
      return;
    }
    this.props.setSelectedDay(details);
  }

  setVisibleStarPopup = (dayId, popup, productTitle) => {
    this.props.updateDayStarValue({dayId, popup, value: true, productTitle});
  };

  navigateToPhotoDiary = () => {
    this.props.navigation.navigate(Routes.PhotoDiaryScreen);
  };

  renderWeekRatingIcon() {
    return (
      <Image
        source={ImageSource.superstar}
        style={styles.fiveStarImageStyle}
        resizeMode={'contain'}
      />
    );
  }

  renderWeek(week, onPress, title) {
    const {
      t,
      marathon: {greatExtensionDays, marathonDays},
    } = this.props;
    const days =
      title === t('marathonStartPage.study')
        ? marathonDays
        : greatExtensionDays;
    const enableWeekRatingIcon = countWeekRating(days, week);

    return (
      <TouchableItem style={styles.startContainer} onPress={onPress}>
        <>
          {enableWeekRatingIcon && this.renderWeekRatingIcon()}
          <View style={styles.dayContent}>
            <Label style={styles.startLabelStyle}>
              {t('marathonStartPage.week')}
            </Label>
            <Label style={styles.weekValueStyle}>{week}</Label>
            <Label style={styles.startLabelStyle}>{title}</Label>
          </View>
        </>
      </TouchableItem>
    );
  }

  renderDay(id, day, onPress, progress) {
    const {selectedDay, t} = this.props;
    const {id: selectedDayId} = selectedDay;
    const bgColor = id === selectedDayId;
    return (
      <TouchableItem
        style={[
          styles.dayContainer,
          bgColor && styles.activeDayBackgroundColor,
        ]}
        ref={this.popoverRef}
        onPress={onPress}>
        <>
          <Rating rating={ratingChecker(progress)} />
          <View style={styles.dayContent}>
            <Label style={styles.dayLabel}>{t('marathonStartPage.day')}</Label>
            <Label style={styles.dayValueStyle}>{day}</Label>
          </View>
        </>
      </TouchableItem>
    );
  }

  renderDays(days, productTitle) {
    return days?.map((item, index) => {
      const {id, day, description, progress} = item;
      const details = {
        id,
        day,
        description,
        productTitle,
      };
      this.currentDayDetails = details;
      const onPress = () => {
        this.onPressDay(details);
      };

      return (
        <React.Fragment key={id + index}>
          {day > 1 && day % 7 === 1 && (
            <>
              <View style={styles.weekDivider} />
              {this.renderWeek(Math.ceil(day / 7), onPress, productTitle)}
            </>
          )}

          {this.renderDay(id, day, onPress, progress)}
        </React.Fragment>
      );
    });
  }

  renderGEStart() {
    const {t, marathon} = this.props;
    const enableWeekRatingIcon = countWeekRating(
      marathon?.greatExtensionDays,
      1,
    );
    return (
      <TouchableItem style={styles.startContainer} disabled>
        <>
          {enableWeekRatingIcon && this.renderWeekRatingIcon()}
          <View style={styles.dayContent}>
            <Label style={styles.startLabelStyle}>
              {t('marathonStartPage.week')}
            </Label>
            <Label style={styles.weekValueStyle}>{1}</Label>
            <Label style={styles.startLabelStyle}>
              {t('marathonStartPage.practice')}
            </Label>
          </View>
        </>
      </TouchableItem>
    );
  }

  renderStart(productTitle) {
    const {marathon, selectedDay, t} = this.props;
    const {id: selectedDayId} = selectedDay;
    const {id, welcomeMessage} = marathon?.welcomeMessage || {};
    const details = {
      id,
      day: t('marathonStartPage.start'),
      description: welcomeMessage,
      start: true,
    };
    this.currentDayDetails = details;
    const bgColor = id === selectedDayId;
    const enableWeekRatingIcon = countWeekRating(marathon?.marathonDays, 1);
    return (
      <TouchableItem
        style={[
          styles.startContainer,
          bgColor && styles.activeDayBackgroundColor,
        ]}
        onPress={() => {
          this.onPressDay(details);
        }}>
        <>
          {enableWeekRatingIcon && this.renderWeekRatingIcon()}
          <View style={styles.dayContent}>
            <Label style={styles.startLabelStyle}>
              {t('marathonStartPage.week')}
            </Label>
            <Label style={styles.weekValueStyle}>{1}</Label>
            <Label style={styles.startLabelStyle}>{productTitle}</Label>
          </View>
        </>
      </TouchableItem>
    );
  }

  renderExtensionDescriptionBar(title, lastSelfieDate, noOfPracticeCourse) {
    const {t} = this.props;
    const date = t('common.formatDate', {
      value: dayjs(lastSelfieDate, 'M/D/YYYY'),
      format: 'DD MMMM ‘YY',
    });
    trackEvent('Practice Started');
    const practice =
      getLanguage() === 'ru'
        ? noOfPracticeCourse
        : addDaySuffix(noOfPracticeCourse);
    return (
      <View style={styles.extensionDescriptionBarStyle}>
        <Label style={styles.extensionDescriptionLabelStyle}>
          {t('marathonStartPage.courseExtensionBarText', {
            title,
            practice,
          })}
        </Label>
        {dayjs(lastSelfieDate, 'M/D/YYYY').isValid() && (
          <Label style={styles.lastSelfieDateStyle}>
            <Text
              allowFontScaling={false}
              style={styles.extensionDescriptionLabelStyle}>
              {t('marathonStartPage.lastSelfieDate')}
            </Text>
            {`\n${date}`}
          </Label>
        )}

        <Pressable
          style={styles.goPhotoDiaryContainer}
          onPress={this.navigateToPhotoDiary}>
          <Image source={ImageSource.arrowRight} style={styles.arrowStyle} />
          <Label style={styles.extensionDescriptionLabelStyle}>
            {t('marathonStartPage.gotoPhotoDiary')}
          </Label>
          <Image source={ImageSource.arrowRight} style={styles.arrowStyle} />
        </Pressable>
      </View>
    );
  }

  renderOldGE = (oldGreatExtensions) => {
    const {t} = this.props;
    return (
      <View style={styles.oldGEContentContainer}>
        {oldGreatExtensions?.map((item, index) => {
          if (index > 2) {
            return;
          }
          return (
            <View style={styles.oldGEContainer} key={index}>
              <Label style={styles.oldGEPracticeCourseNumStyle}>
                {index === 2 ? oldGreatExtensions.length : index + 1}
              </Label>
              <Label style={styles.oldGEPracticeCourseTextStyle}>
                {t('marathonStartPage.pc')}
              </Label>
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const {
      marathon,
      t,
      termsAccepted,
      shouldShowTooltip,
      dayStar,
      selectedDay,
    } = this.props;
    const {
      marathonDays,
      greatExtensionDays,
      title,
      lastSelfieDate,
      oldGreatExtensions,
      isDemoCourse,
    } = marathon || {};
    const {
      id: dayId,
      productTitle: _productTitle,
      isShowThreeStarPopup,
      isShowFiveStarPopup,
    } = selectedDay;
    const shouldShowFiveStarPopup = !isShowFiveStarPopup && dayStar === 5;
    const shouldShowThreeStarPopup = !isShowThreeStarPopup && dayStar === 3;
    const noOfPracticeCourse = oldGreatExtensions?.length + 1 || 1;
    const isOldExtensionsExist = oldGreatExtensions?.length > 0;
    const productTitle = isDemoCourse
      ? t('marathonStartPage.demo')
      : t('marathonStartPage.study');
    const isVisibleTooltip =
      marathonDays?.length === 1 && termsAccepted && shouldShowTooltip;
    return (
      <View style={styles.container}>
        {this.renderStart(productTitle)}

        {this.renderDays(marathonDays, productTitle)}

        {!!greatExtensionDays?.length &&
          this.renderExtensionDescriptionBar(
            title,
            lastSelfieDate,
            noOfPracticeCourse,
          )}

        {isOldExtensionsExist && this.renderOldGE(oldGreatExtensions)}

        {!!greatExtensionDays?.length && this.renderGEStart()}

        {!!greatExtensionDays?.length &&
          this.renderDays(greatExtensionDays, t('marathonStartPage.practice'))}
        <Popover
          placement={'top'}
          isVisible={isVisibleTooltip}
          from={this.popoverRef}
          arrowStyle={styles.popoverArrowStyle}
          popoverStyle={styles.popoverStyle}
          onRequestClose={() => this.props.setTooltip(false)}>
          <Label style={styles.tooltipTextStyle}>
            {t('marathonStartPage.startYourFirstDay')}
          </Label>
        </Popover>
        {(shouldShowFiveStarPopup || shouldShowThreeStarPopup) && (
          <GetStarCongratulationPopup
            star={dayStar}
            setVisibleStarPopup={() =>
              this.setVisibleStarPopup(dayId, dayStar, _productTitle)
            }
          />
        )}
      </View>
    );
  }
}

const mpaStateToProps = {
  marathon: selectMarathon,
  selectedDay: selectSelectedDay,
  isDemoCourse: selectDemoCourse,
  termsAccepted: selectIsTermsAccepted,
  shouldShowTooltip: selectShouldShowTooltip,
  dayStar: selectDayStar,
};

export default withTranslation('', {withRef: true})(
  connectStructuredSelector(
    mpaStateToProps,
    {
      setSelectedDay,
      getDayExercise,
      activeExerciseId,
      setTooltip,
      updateDayStarValue,
    },
    null,
    {forwardRef: true},
  )(MarathonDays),
);
