/**
 * Cache Image
 * cache remote image
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {Image, ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import {fixUrl} from '@app/utils';
import {styles} from './styles';

// Types
type Props = FastImageProps & {
  placeholderSource: number,
  loaderShown: Boolean,
  loaderProps: ActivityIndicatorProps,
};

const CacheImage = (props: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    placeholderSource,
    loaderShown,
    downloadShown,
    resizeMode,
    source,
    loaderProps,
    style,
    onLoadEnd,
    ...rest
  } = props;

  const isLocalImage = typeof source === 'number';

  let uri;
  if (!isLocalImage) {
    /**
     * In api there is a problem with image url.
     * url have `\\` instead of `/`. So to render
     * image we need to replace `\\` with '/' until
     * api issue not resolve.
     */
    uri = fixUrl(source?.uri);
  }

  const imageSource = isLocalImage ? source : {uri};

  const _onLoadEnd = () => {
    setLoading(false);
    onLoadEnd?.();
  };

  return (
    <>
      <FastImage
        source={imageSource}
        style={style}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setImageLoaded(true)}
        onLoadEnd={_onLoadEnd}
        resizeMode={resizeMode}
        {...rest}>
        {!imageLoaded && placeholderSource && (
          <Image
            source={placeholderSource}
            style={[styles.placeholderImageStyle, {resizeMode}]}
          />
        )}

        {loading && loaderShown && (
          <ActivityIndicator
            style={styles.loaderStyle}
            color="gray"
            {...loaderProps}
          />
        )}
        {loading && downloadShown && (
          <LottieView
            source={require('@app/assets/animation/download.json')}
            autoPlay
            resizeMode="contain"
            style={styles.animationStyle}
          />
        )}
      </FastImage>
    </>
  );
};

export {CacheImage};
