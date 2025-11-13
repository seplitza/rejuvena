/**
 * Exercise Rules
 * @flow
 * @format
 */

import React, {useState, useRef} from 'react';
import {Image, View, Pressable} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Collapsible from 'react-native-collapsible';
import {
  connectStructuredSelector,
  tweakHtml,
  handleWebviewClickScript,
  onClickFromWebview,
} from '@app/utils';
import {acceptMarathonTerms} from '../slice';
import {selectMarathonRegulation, selectIsTermsAccepted} from '../selectors';
import {ImageSource} from '@app/common';
import {Label, TouchableItem, Icon} from '@app/components';
import {withTranslation} from '@app/translations';
import {regulationStyles as styles, rulesHtmlStyles} from './styles';
import {CurvedHeader} from './curved-header';

type Props = {
  regulations: string,
  termsAccepted: boolean,
  acceptMarathonTerms: typeof acceptMarathonTerms,
};

const ExerciseRules = (props: Props) => {
  const webviewRef = useRef(null);
  const {regulations, termsAccepted, t} = props;
  const [isRulesVisible, toggleRulesVisibility] = useState(true);
  const [webviewWidth, setWebviewWidth] = useState(null);
  return (
    <>
      <Pressable onPress={() => toggleRulesVisibility(!isRulesVisible)}>
        <CurvedHeader
          title={t('marathonStartPage.rulesToFollow')}
          isVisible={isRulesVisible}
          termsAccepted={termsAccepted}
        />
      </Pressable>

      <View
        style={styles.contentContainer}
        onLayout={(event) => setWebviewWidth(event.nativeEvent.layout.width)}>
        <Collapsible
          style={styles.collapsibleStyle}
          collapsed={!isRulesVisible}>
          {!!regulations && (
            <AutoHeightWebView
              ref={webviewRef}
              originWhitelist={['*']}
              textZoom={100}
              source={{html: tweakHtml(regulations)}}
              bounces={false}
              scrollEnabled={false}
              style={{width: webviewWidth}}
              customStyle={rulesHtmlStyles}
              customScript={handleWebviewClickScript}
              onMessage={onClickFromWebview}
            />
          )}
          <View style={styles.agreeRulesContainer}>
            <TouchableItem
              style={styles.checkBoxContainer}
              onPress={() => props.acceptMarathonTerms(!termsAccepted)}>
              <Image
                source={
                  termsAccepted
                    ? ImageSource.termsChecked
                    : ImageSource.termsUnChecked
                }
                style={styles.checkBoxImgStyle}
              />
            </TouchableItem>
            <Label style={styles.agreeRulesLabel}>
              {t('marathonStartPage.readAccepted')}
            </Label>
            {termsAccepted && (
              <Icon
                type="EvilIcons"
                name="close"
                style={styles.closeIconStyle}
                onPress={() => toggleRulesVisibility(!isRulesVisible)}
              />
            )}
          </View>
        </Collapsible>
      </View>
    </>
  );
};

const mapStateToProps = {
  regulations: selectMarathonRegulation,
  termsAccepted: selectIsTermsAccepted,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    acceptMarathonTerms,
  })(ExerciseRules),
);
