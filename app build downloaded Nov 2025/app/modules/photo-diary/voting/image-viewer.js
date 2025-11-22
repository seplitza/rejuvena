/**
 * Image Viewer Component
 * @flow
 * @format
 */

import React from 'react';
import {View, Image, Pressable, ImageBackground} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import LottieView from 'lottie-react-native';
import dayjs from 'dayjs';
import {Label, CacheImage, TouchableItem} from '@app/components';
import {ImageSource} from '@app/common';
import styles from './styles';

export default class ImageViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  prevCollage = () => {
    this.setState((prevState) => ({
      index: prevState.index > 1 && prevState.index - 1,
    }));
  };

  nextCollage = (allSize) => {
    this.setState((prevState) => ({
      index: prevState.index < allSize - 1 && prevState.index + 1,
    }));
  };

  getArrowIcon = (icon, onPress) => {
    return (
      <TouchableItem style={styles.arrowButtonStyle} onPress={onPress}>
        <Image
          source={icon}
          style={styles.arrowIconStyle}
          resizeMode="contain"
        />
      </TouchableItem>
    );
  };

  render() {
    const {
      finalistAndWinners,
      t,
      isItForFinalist,
      navigateTo,
      likeFinalist,
      showContestRules,
    } = this.props;
    const {index} = this.state;

    return (
      <>
        {finalistAndWinners?.length > 0 ? (
          <>
            <Label style={styles.headingNameStyle}>
              {isItForFinalist
                ? `${t('inspirations.rejuvenationChallenge', {
                    value: dayjs(),
                    format: 'MMMM',
                  })}`
                : t('inspirations.winnerOfContest')}
            </Label>
            {isItForFinalist && (
              <ImageBackground
                source={ImageSource.prizeWinner}
                style={styles.prizeBoxImageStyle}
                resizeMode="contain">
                <Label style={styles.prizeAmountStyle}>500$</Label>
              </ImageBackground>
            )}
            <ImageViewer
              imageUrls={finalistAndWinners?.map((x) => ({
                url: x?.imagePath,
              }))}
              doubleClickInterval={400}
              saveToLocalByLongPress={false}
              backgroundColor={'#fff'}
              useNativeDriver
              enablePreload
              index={index}
              loadingRender={() => (
                <LottieView
                  autoPlay
                  loop
                  source={require('@app/assets/animation/loading.json')}
                  style={styles.lottieStyle}
                  hardwareAccelerationAndroid
                />
              )}
              renderIndicator={() => {}}
              footerContainerStyle={styles.footerContainerStyle}
              renderImage={(props) => (
                <CacheImage
                  placeholderSource={ImageSource.imagePlaceholder}
                  source={props?.source}
                  style={styles.userImage}
                  resizeMode="contain"
                  loaderShown
                />
              )}
              renderFooter={(currentIndex) => (
                <View style={styles.buttonContainerStyle}>
                  {this.getArrowIcon(
                    ImageSource.arrowLeftWhite,
                    this.prevCollage,
                  )}
                  <Pressable
                    style={styles.likeContainerStyle}
                    onPress={navigateTo}>
                    <Image
                      source={
                        isItForFinalist
                          ? ImageSource.trophy
                          : ImageSource.thumbUp
                      }
                      style={styles.rulesIcon}
                      resizeMode="contain"
                    />
                    <Label style={styles.labelStyle}>
                      {isItForFinalist
                        ? t('inspirations.winner')
                        : t('inspirations.challenge')}
                    </Label>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      isItForFinalist && likeFinalist(currentIndex)
                    }>
                    <ImageBackground
                      source={
                        isItForFinalist
                          ? finalistAndWinners?.[currentIndex]?.isVoted
                            ? ImageSource.like
                            : ImageSource.vote
                          : ImageSource.goldCup
                      }
                      style={[
                        styles.voteImage,
                        isItForFinalist && styles.tintColor,
                      ]}
                      resizeMode="contain">
                      {isItForFinalist && (
                        <Label style={styles.totalVoteStyle}>
                          {finalistAndWinners[currentIndex]?.totalVote}
                        </Label>
                      )}
                    </ImageBackground>
                  </Pressable>
                  <Pressable
                    style={styles.likeContainerStyle}
                    onPress={showContestRules}>
                    <Image
                      source={ImageSource.rules}
                      style={styles.rulesIcon}
                    />
                    <Label style={styles.labelStyle}>
                      {t('inspirations.rules')}
                    </Label>
                  </Pressable>
                  {this.getArrowIcon(ImageSource.arrowRightWhite, () =>
                    this.nextCollage(finalistAndWinners?.length),
                  )}
                </View>
              )}
            />
          </>
        ) : (
          <View style={styles.emptyLabelContainer}>
            <Label style={styles.emptyLabelStyle}>
              {isItForFinalist
                ? t('inspirations.emptyFinalist')
                : t('inspirations.emptyWinners')}
            </Label>
          </View>
        )}
      </>
    );
  }
}
