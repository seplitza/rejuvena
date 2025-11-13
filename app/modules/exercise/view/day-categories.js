/**
 * Day Categories
 * @flow
 * @format
 */

import React, {useCallback} from 'react';
import {Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Label, CacheImage} from '@app/components';
import {gradients} from '@app/styles';
import {connectStructuredSelector} from '@app/utils';
import {
  selectDayExercise,
  selectChangingStatusRequests,
  selectUpdatedExercisesStatus,
  selectActiveExercise,
} from '../selectors';
import {changeExerciseStatus, activeExerciseId} from '../slice';
import {ExerciseNameHeader} from './exercise-name-header';
import {ExerciseDetail} from './exercise-detail';
import {dayPlanStyles as styles} from './styles';

type Props = {
  dayExercise: Object,
  changingStatusRequests: Object,
  updatedExercisesStatus: Object,
  changeExerciseStatus: typeof changeExerciseStatus,
};

const DayCategories = (props: Props) => {
  const {
    dayExercise,
    changingStatusRequests,
    updatedExercisesStatus,
    activeExercise,
    navigation,
  } = props;
  const {dayCategories, id: dayId} = dayExercise?.marathonDay || {};
  const changeSection = (id, exercise) => {
    let exerciseId = activeExercise === id ? null : id;
    props.activeExerciseId({exerciseId});
  };

  const onMarkDoneUndone = useCallback(
    (marathonExerciseId, status, uniqueId) => {
      props.changeExerciseStatus({
        marathonExerciseId,
        status,
        dayId,
        uniqueId,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!dayCategories?.length) {
    return null;
  }
  return dayCategories.map((item) => {
    const {id, imagePath, categoryName, exercises} = item;

    return (
      <React.Fragment key={id}>
        <LinearGradient
          locations={[0, 0.1, 0.95, 1]}
          colors={gradients.category}
          style={styles.categoryContainer}>
          <CacheImage
            source={{uri: imagePath}}
            style={styles.categoryIconStyle}
          />
          <Label style={styles.categoryNameStyle}>{categoryName}</Label>
        </LinearGradient>

        {exercises?.map((exercise, index) => {
          const uniqueId = index + id + exercise.id;
          return (
            <React.Fragment key={uniqueId}>
              <Pressable
                disabled={exercise?.blockExercise}
                onPress={() => changeSection(uniqueId, exercise)}>
                <ExerciseNameHeader
                  uniqueId={uniqueId}
                  exercise={exercise}
                  onChangeStatus={onMarkDoneUndone}
                  changingStatus={changingStatusRequests[uniqueId]}
                  updatedStatus={updatedExercisesStatus[uniqueId]}
                  active={activeExercise === uniqueId}
                />
              </Pressable>
              {activeExercise === uniqueId && (
                <ExerciseDetail
                  navigation={navigation}
                  exercise={exercise}
                  index={0}
                  showHeader={true}
                />
              )}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
};

const mapStateToProps = {
  dayExercise: selectDayExercise,
  updatedExercisesStatus: selectUpdatedExercisesStatus,
  changingStatusRequests: selectChangingStatusRequests,
  activeExercise: selectActiveExercise,
};

export default connectStructuredSelector(mapStateToProps, {
  changeExerciseStatus,
  activeExerciseId,
})(DayCategories);
