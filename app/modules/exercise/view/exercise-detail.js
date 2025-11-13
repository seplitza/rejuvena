/**
 * Exercise Detail
 * @flow
 * @format
 */

import React from 'react';
import {Image, Pressable} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from '@app/translations';
import {ImageSource, Routes} from '@app/common';
import {Label, VideoPlayer, CacheImage} from '@app/components';
import {gradients} from '@app/styles';
import {useSelector} from 'react-redux';
import {selectCourseLanguage} from '../selectors';
import {exerciseStyles as styles} from './styles';

type Props = {
  exercise: Object,
};

const ExerciseDetail = ({exercise, index, navigation, showHeader}: Props) => {
  const {exerciseContents, exerciseName} = exercise || {};
  const {t} = useTranslation();
  const courseLanguage = useSelector(selectCourseLanguage);
  const getArrowIcon = (icon) => {
    return <Image source={icon} style={styles.arrowIconStyle} />;
  };

  const imagePlaceholder =
    courseLanguage === 'ru'
      ? ImageSource.ruGIFPlaceholder
      : courseLanguage === 'es'
      ? ImageSource.esGIFPlaceholder
      : ImageSource.enGIFPlaceholder;
  const descriptionIcon =
    courseLanguage === 'ru'
      ? ImageSource.ruDescriptionIcon
      : courseLanguage === 'es'
      ? ImageSource.esDescriptionIcon
      : ImageSource.enDescriptionIcon;
  const tapForVideoLabel =
    courseLanguage === 'ru'
      ? 'перейти на видео'
      : courseLanguage === 'es'
      ? 'toque para video'
      : 'tap for video';

  return (
    <>
      <Swiper
        ref={(ref) => {
          this.swiper = ref;
        }}
        loop={false}
        showsPagination={false}
        showsButtons
        loadMinimal
        index={index}
        loadMinimalSize={0}
        containerStyle={styles.swiper}
        nextButton={getArrowIcon(ImageSource.forward)}
        prevButton={getArrowIcon(ImageSource.back)}>
        {exerciseContents?.map((content) => {
          const {type, contentPath} = content;
          if (contentPath.endsWith('.gif') && showHeader) {
            return (
              <React.Fragment key={content.id}>
                <Label
                  onPress={() => this.swiper?.scrollBy(1)}
                  style={styles.tapForVideoTextStyle}>
                  {tapForVideoLabel}
                </Label>
                <Pressable
                  style={styles.gifContainer}
                  onPress={() => this.swiper?.scrollBy(1)}>
                  <CacheImage
                    placeholderSource={imagePlaceholder}
                    downloadShown
                    resizeMode={'contain'}
                    source={{uri: contentPath}}
                    style={styles.contentImageStyle}
                  />
                </Pressable>
              </React.Fragment>
            );
          }

          if (type === 'image' && !contentPath.endsWith('.gif')) {
            return (
              <CacheImage
                key={content.id}
                placeholderSource={ImageSource.imagePlaceholder}
                loaderShown
                source={{uri: contentPath}}
                style={styles.contentImageStyle}
              />
            );
          }
          if (type === 'video') {
            return (
              <VideoPlayer
                key={content.id}
                scrollEnabled={false}
                source={{
                  uri: content.contentPath + '?autoplay=1&loop=0&autopause=0',
                }}
                startInLoadingState
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo
              />
            );
          }
        })}
      </Swiper>
      {showHeader && (
        <>
          <Pressable
            onPress={() =>
              navigation.navigate(Routes.DescriptionCommentTabScreen, {
                exercise,
                activeTabIndex: 0,
              })
            }
            style={styles.descriptionHeader}>
            <LinearGradient
              locations={[0, 0.06, 0.94, 1]}
              colors={gradients.description}
              style={styles.absoluteFill}
            />
            <Image source={descriptionIcon} style={styles.imageStyle} />

            <Label style={styles.descriptionHeaderTitleStyle}>
              {exerciseName}
            </Label>
            <Image
              source={ImageSource.arrowRight}
              style={[styles.forwardIconStyle, styles.tintColor]}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate(Routes.DescriptionCommentTabScreen, {
                exercise,
                activeTabIndex: 1,
              })
            }
            style={styles.descriptionHeader}>
            <LinearGradient
              locations={[0, 0.06, 0.94, 1]}
              colors={gradients.heading}
              style={styles.absoluteFill}
            />
            <Image source={ImageSource.quesAns} style={styles.imageStyle} />
            <Label style={styles.headerLabelStyle}>
              {t('userMarathonDailyExercisePage.questionAns')}
            </Label>
            <Image
              source={ImageSource.arrowRight}
              style={styles.forwardIconStyle}
            />
          </Pressable>
        </>
      )}
    </>
  );
};

export {ExerciseDetail};
