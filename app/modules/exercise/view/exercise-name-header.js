/**
 * Exercise Name Header
 * @flow
 * @format
 */

import React from 'react';
import {View, Image, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {gradients} from '@app/styles';
import {ImageSource} from '@app/common';
import {Label, Icon} from '@app/components';
import {dayPlanStyles as styles} from './styles';

class ExerciseNameHeader extends React.PureComponent {
  getExerciseColor(exercise, status) {
    const {isNew, blockExercise} = exercise;
    if (isNew) {
      return gradients.newExercise;
    }
    if (blockExercise) {
      return gradients.blockExercise;
    }
    if (status) {
      return gradients.exercise;
    }

    return gradients.heading;
  }

  renderLoading() {
    return (
      <LottieView
        autoPlay
        source={require('@app/assets/animation/v-check-loading.json')}
        style={styles.loadingIconStyle}
      />
    );
  }

  render() {
    const {
      exercise,
      changingStatus,
      onChangeStatus,
      updatedStatus,
      uniqueId,
      active,
    } = this.props;
    const {
      marathonExerciseId,
      exerciseName,
      marathonExerciseName,
      isDone,
      isNew,
      blockExercise,
    } = exercise;
    const status = updatedStatus !== undefined ? updatedStatus : isDone;
    const gradientColor = this.getExerciseColor(exercise, status);

    return (
      <LinearGradient
        locations={
          blockExercise ? null : isNew ? [0, 0.35, 0.65, 1] : [0, 0.06, 0.94, 1]
        }
        colors={gradientColor}
        style={[
          styles.headerContainer,
          blockExercise && styles.blockBorderColor,
        ]}>
        <Pressable
          style={styles.checkIconContainer}
          disabled={changingStatus || blockExercise}
          onPress={() => onChangeStatus(marathonExerciseId, !status, uniqueId)}>
          {changingStatus ? (
            this.renderLoading()
          ) : (
            <Image
              source={ImageSource.check}
              style={[styles.checkIconStyle, status && styles.checkActiveStyle]}
            />
          )}
        </Pressable>

        <View style={styles.exerciseNameContainer}>
          <Label
            style={[
              styles.minDescriptionStyle,
              status && styles.textOpacityStyle,
            ]}>
            <Label style={styles.exerciseNameStyle}>{exerciseName}</Label>{' '}
            {marathonExerciseName}
          </Label>
          <Icon
            type="Ionicons"
            name={active ? 'chevron-up' : 'chevron-down'}
            style={styles.upDownIconStyle}
          />
        </View>
      </LinearGradient>
    );
  }
}

export {ExerciseNameHeader};
