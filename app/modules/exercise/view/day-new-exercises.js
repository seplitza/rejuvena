/**
 * Day New Exercises
 * @flow
 * @format
 */

import React from 'react';
import {Image, View, Pressable, Text, useWindowDimensions} from 'react-native';
import RenderHtml, {
  CustomBlockRenderer,
  TNodeChildrenRenderer,
} from 'react-native-render-html';
import {connectStructuredSelector} from '@app/utils';
import {selectNewExercise, selectActiveExercise} from '../selectors';
import {addLeadingZero} from '@app/utils';
import {ImageSource} from '@app/common';
import {Label, VideoPlayer, CacheImage} from '@app/components';
import {useTranslation} from '@app/translations';
import {ExerciseDetail} from './exercise-detail';
import {exerciseStyles as styles} from './styles';
import {activeExerciseId} from '../slice';

type Props = {
  exercises: Array<Object>,
};

const ExerciseDescRenderer: CustomBlockRenderer = ({
  TDefaultRenderer,
  tnode,
  ...props
}) => {
  return (
    <TDefaultRenderer tnode={tnode} {...props}>
      <TNodeChildrenRenderer
        tnode={tnode}
        renderChild={({key, childElement}) => (
          <Text key={key} allowFontScaling={false} numberOfLines={1}>
            {childElement}
          </Text>
        )}
      />
    </TDefaultRenderer>
  );
};

const DayNewExercises = (props: Props) => {
  const {exercises, activeExercise, navigation} = props;
  const {t} = useTranslation();
  const {width} = useWindowDimensions();

  const renderExercise = (exercise, index) => {
    const {id, exerciseContents, exerciseName, exerciseDescription} = exercise;
    const {type, contentPath} = exerciseContents[0] || {};
    const renderHtmlProps = {
      source: {html: exerciseDescription},
      renderers: {
        p: ExerciseDescRenderer,
      },
    };
    return (
      <View
        style={[
          styles.dayExerciseContainer,
          index % 2 && styles.dayExerciseContainerOddStyle,
        ]}>
        <Label
          style={[
            styles.exerciseNumberLabelStyle,
            index % 2 && styles.exerciseNumberLabelOddStyle,
          ]}>
          {addLeadingZero(index + 1)}
          {'\n'}
          <Label
            style={[
              styles.newLabelStyle,
              index % 2 && styles.exerciseNumberLabelOddStyle,
            ]}>
            {t('userMarathonDailyExercisePage.new')}
          </Label>
        </Label>

        <Pressable
          onPress={() => props.activeExerciseId({exerciseId: id})}
          style={styles.exerciseDetailContainer}>
          <View style={styles.contentContainer}>
            {type === 'video' ? (
              <VideoPlayer
                source={{uri: contentPath}}
                style={styles.videoStyle}
                allowsFullscreenVideo
              />
            ) : (
              <CacheImage
                placeholderSource={ImageSource.imagePlaceholder}
                source={{uri: contentPath}}
                style={styles.videoStyle}
              />
            )}
          </View>
          <Label style={styles.exerciseNameStyle}>{exerciseName}</Label>
          <RenderHtml
            ignoredStyles={['fontFamily', 'lineHeight']}
            ignoredDomTags={['iframe', 'font']}
            contentWidth={width}
            baseStyle={styles.exerciseDescriptionStyle}
            {...renderHtmlProps}
          />
        </Pressable>
        <Image
          source={ImageSource.exeVidExtension}
          style={styles.exeVidImageStyle}
        />
      </View>
    );
  };

  return (
    exercises?.map((exercise, index) => {
      return (
        <React.Fragment key={exercise.id}>
          {activeExercise === exercise.id ? (
            <ExerciseDetail
              exercise={exercise}
              index={1}
              navigation={navigation}
              showHeader={true}
            />
          ) : (
            renderExercise(exercise, index)
          )}
        </React.Fragment>
      );
    }) || null
  );
};

const mapStateToProps = {
  exercises: selectNewExercise,
  activeExercise: selectActiveExercise,
};

export default connectStructuredSelector(mapStateToProps, {
  activeExerciseId,
})(DayNewExercises);
