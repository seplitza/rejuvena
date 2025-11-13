/**
 * Day Plan
 * @flow
 * @format
 */

import React, {useState, useEffect} from 'react';
import {View, Pressable} from 'react-native';
import {connectStructuredSelector} from '@app/utils';
import {useTranslation} from '@app/translations';
import {selectDayExercise} from '../selectors';
import {Icon} from '@app/components';
import DayCategories from './day-categories';
import DayNewExercises from './day-new-exercises';
import {dayPlanStyles as styles} from './styles';
import {CurvedHeader} from './curved-header';

type Props = {
  dayExercise: Object | null,
};

const DayPlan = (props: Props) => {
  const {dayExercise, navigation} = props;
  const [dayPlanShown, setDayPlanShown] = useState(true);
  const {t} = useTranslation();

  useEffect(() => {
    // On change exercise day need to reopen plan
    setDayPlanShown(true);
  }, [dayExercise]);

  if (!dayExercise) {
    return null;
  }
  return (
    <>
      {/* Plan Header */}
      <Pressable
        style={styles.contentContainer}
        onPress={() => setDayPlanShown(!dayPlanShown)}>
        <CurvedHeader
          title={t('userMarathonDailyExercisePage.dayPlan')}
          isVisible={dayPlanShown}
          termsAccepted={true}
        />
      </Pressable>

      {/* Plan list */}
      <View style={styles.dayContent}>
        {dayPlanShown && (
          <>
            <DayCategories navigation={navigation} />
            <Pressable
              onPress={() => setDayPlanShown(!dayPlanShown)}
              style={styles.closeIconContainer}>
              <Icon
                type="EvilIcons"
                name="close"
                style={styles.closeIconStyle}
              />
            </Pressable>
          </>
        )}
      </View>

      {/* Day new exercises */}
      <View style={styles.newExerciseContainer}>
        <DayNewExercises navigation={navigation} />
      </View>
    </>
  );
};

const mapStateToProps = {
  dayExercise: selectDayExercise,
};

export default connectStructuredSelector(mapStateToProps)(DayPlan);
