/**
 * Auth Container
 * @flow
 * @format
 */

import React, {useEffect} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation-locker';
import {Label, Container} from '@app/components';
import {useTranslation} from '@app/translations';
import {LanguagePicker} from '@app/modules/shared';
import {styles} from './styles';

// TODO: define proper props type
type Props = {
  children: React$Node,
  title: string,
  showLanguagePicker: boolean,
  hideHeadingCaption: boolean,
};

const AuthContainer = (props: Props) => {
  const {t} = useTranslation();
  useEffect(() => {
    // this unlocks any previous locks to all Orientations
    Orientation.unlockAllOrientations();
  }, []);

  const {children, title, showLanguagePicker, hideHeadingCaption} = props;

  return (
    <Container>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}>
        {showLanguagePicker && (
          <View style={styles.languagePickerContainerStyle}>
            <LanguagePicker />
          </View>
        )}
        {!hideHeadingCaption && (
          <>
            {title && <Label style={styles.title}>{title}</Label>}
            <Label style={styles.appName}>Natural Rejuvenation</Label>
            <Label style={styles.appTagName}>
              {t('authPage.faceRejuvenation')}
            </Label>
          </>
        )}
        {children}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export {AuthContainer};
