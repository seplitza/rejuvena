/**
 * Animated Loading Screen
 * @flow
 * @format
 */

import React from 'react';
import {Platform, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import VersionCheck from 'react-native-version-check';
import {connectStructuredSelector, versionCompare} from '@app/utils';
import {Label, Container} from '@app/components';
import {selectGeneralSettings} from '@app/modules/common';
import {EStyleSheet} from '@app/styles';
import {Strings} from '@app/common';
import {UpdateAvailable} from '@app/components';
import {initApp} from '../slice';
import {selectIsAppReady} from '../selectors';

//-----------( Types )-----------
type Props = {
  rehydrate: boolean,
  ready: boolean,
  children: React$Node,
  initApp: typeof initApp,
};
//-------------------------------

class AppInitGate extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {hideUpdatePopup: false};
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.rehydrate !== this.props.rehydrate) {
      this.props.initApp();
    }
  }

  isUpdateAvailable = (generalSettings) => {
    const {androidVersion, iosVersion} = generalSettings || {};
    const latestVersion = Platform.select({
      ios: iosVersion,
      android: androidVersion,
    });
    const currentVersion = VersionCheck.getCurrentVersion();
    return versionCompare(latestVersion, currentVersion) > 0;
  };

  mustUpdate = (generalSettings) => {
    const {minAndroidVersion, minIosVersion} = generalSettings || {};
    const minReqVersion = Platform.select({
      ios: minIosVersion,
      android: minAndroidVersion,
    });
    const currentVersion = VersionCheck.getCurrentVersion();
    return versionCompare(minReqVersion, currentVersion) > 0;
  };

  hideUpdatePopup = () => {
    this.setState({hideUpdatePopup: true});
  };

  render() {
    const {hideUpdatePopup} = this.state;
    const {ready, children, generalSettings} = this.props;
    const {common} = Strings;

    if (ready) {
      if (!hideUpdatePopup && this.isUpdateAvailable(generalSettings)) {
        return (
          <UpdateAvailable
            mustUpdate={this.mustUpdate(generalSettings)}
            onDismiss={this.hideUpdatePopup}
          />
        );
      }

      return children;
    }

    return (
      <Container style={styles.container}>
        <Label style={styles.title}>{common.look}</Label>
        <Label style={styles.subTitle}>{common.younger}</Label>
        <LottieView
          source={require('@app/assets/animation/splash.json')}
          autoPlay
          style={styles.animationStyle}
          hardwareAccelerationAndroid
          resizeMode="contain"
        />
        <Label style={styles.bottomLabel}>{common.now}</Label>
        {/*
            Disable back press during Splash animation.
            so that didn't impact on app init.
        */}
        <Modal transparent visible animationType="none" />
      </Container>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  animationStyle: {
    '@media ios': {
      marginTop: '15@ms',
    },
    '@media android': {
      marginTop: '35@ms',
    },
  },
  title: {
    fontSize: '130@ms',
    lineHeight: '120@ms',
    paddingTop: '10@ms',
    fontFamily: '$fonts.PhosphateInline',
  },
  subTitle: {
    fontSize: '74@ms',
    lineHeight: '70@ms',
    fontFamily: '$fonts.PhosphateInline',
    marginTop: '-15@ms',
  },
  bottomLabel: {
    fontSize: '146@ms',
    fontFamily: '$fonts.PhosphateInline',
    bottom: '-15@ms',
    position: 'absolute',
  },
});

const mapStateToProps = {
  ready: selectIsAppReady,
  generalSettings: selectGeneralSettings,
};

export default connectStructuredSelector(mapStateToProps, {initApp})(
  AppInitGate,
);
