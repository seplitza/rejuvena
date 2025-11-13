/**
 * Exercise Video Player
 * @flow
 * @format
 */

import React, {useRef, useState} from 'react';
import {View, Pressable} from 'react-native';
import LottieView from 'lottie-react-native';
import {WebView} from '@app/components/webview';
import type {WebViewProps} from 'react-native-webview';
import {useTranslation} from '@app/translations';
import {Icon, Label} from '@app/components';
import {styles} from './styles';

const VideoPlayer = (props: WebViewProps) => {
  const videoPlayerRef = useRef(null);
  const [reload, setReload] = useState(false);
  const {startInLoadingState} = props;
  const {t} = useTranslation();

  const reloadVideo = () => {
    setReload(false);
    videoPlayerRef.current?.reload();
  };

  const loadingContent = () => {
    return (
      <View style={styles.loadingContainer}>
        <Label style={styles.appNameStyle}>{'FaceLift'}</Label>
        <Label style={styles.messageStyle}>
          {t('common.uploadingContent')}
        </Label>
        <LottieView
          source={require('@app/assets/animation/download.json')}
          autoPlay
          resizeMode="contain"
          style={styles.animationStyle}
        />
        <Label style={styles.messageStyle}>{t('common.networkMessage')}</Label>
      </View>
    );
  };

  return (
    <>
      <WebView
        onRef={videoPlayerRef}
        startInLoadingState={startInLoadingState}
        renderLoading={loadingContent}
        onError={() => setReload(true)}
        {...props}
      />
      {reload && (
        <Pressable onPress={reloadVideo} style={styles.loadingContainer}>
          <Icon
            type="Ionicons"
            name="reload-circle"
            style={styles.reloadIconStyle}
          />
        </Pressable>
      )}
    </>
  );
};

export {VideoPlayer};
