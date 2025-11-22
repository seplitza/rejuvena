/**
 * Exercise Description
 * @flow
 * @format
 */

import React, {useRef, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import LinearGradient from 'react-native-linear-gradient';
import {
  connectStructuredSelector,
  tweakHtml,
  handleWebviewClickScript,
  onClickFromWebview,
} from '@app/utils';
import {selectSelectedDay} from '../selectors';
import {gradients} from '@app/styles';
import {
  descriptionStyles as styles,
  htmlStartTextStyles,
  htmlDayTextStyles,
  iframeCustomStyle,
} from './styles';

type Props = {
  selectedDay: Object,
  style: any,
};

const ExerciseDescription = (props: Props) => {
  const scrollViewRef = useRef(null);
  const webviewRef = useRef(null);
  const {selectedDay, style} = props;
  const {description, day} = selectedDay || {};

  useEffect(() => {
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});
  }, [selectedDay]);

  if (!description) {
    return null;
  }
  let htmlTextStyles =
    day === 'start' ? htmlStartTextStyles : htmlDayTextStyles;
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewStyle}
        bounces={false}
        nestedScrollEnabled={true}>
        <View style={styles.webViewContainer}>
          <AutoHeightWebView
            ref={webviewRef}
            originWhitelist={['*']}
            textZoom={100}
            source={{
              html: htmlTextStyles + tweakHtml(description),
            }}
            customStyle={iframeCustomStyle}
            bounces={false}
            scrollEnabled={false}
            style={styles.webViewStyle}
            customScript={handleWebviewClickScript}
            onMessage={onClickFromWebview}
          />
        </View>
      </ScrollView>
      <LinearGradient
        pointerEvents="none"
        colors={gradients.featherEffect}
        style={styles.featherEffectStyle}
      />
    </View>
  );
};

const mapStateToProps = {
  selectedDay: selectSelectedDay,
};

export default connectStructuredSelector(mapStateToProps)(ExerciseDescription);
