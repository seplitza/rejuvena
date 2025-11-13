/**
 * Description Screen
 * @flow
 * @format
 */

import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {exerciseStyles as styles, htmlDescriptionStyles} from './styles';
import {
  tweakHtml,
  handleWebviewClickScript,
  onClickFromWebview,
} from '@app/utils';

type Props = {
  exercise: Object,
};

const DescriptionSection = ({exercise}: Props) => {
  const {exerciseDescription} = exercise || {};
  return (
    <AutoHeightWebView
      originWhitelist={['*']}
      textZoom={100}
      source={{
        html: htmlDescriptionStyles + tweakHtml(exerciseDescription),
      }}
      bounces={false}
      scrollEnabled={false}
      style={styles.descriptionContent}
      customScript={handleWebviewClickScript}
      onMessage={onClickFromWebview}
    />
  );
};

export default DescriptionSection;
