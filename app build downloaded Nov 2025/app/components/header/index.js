/**
 * Header
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {View, StatusBar, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationService} from '@app/utils';
import {ImageSource} from '@app/common';
import {Icon} from '@app/components/icon';
import {HeaderButton} from '@app/components/header-button';
import {Label} from '@app/components/label';
import {gradients} from '@app/styles';
import {NotificationIcon} from '../notification-icon';
import {styles} from './styles';

// Header types
type Props = {
  canGoBack?: boolean,
  canAccessDrawer?: boolean,
  title?: string,
};

const BackButton = () => {
  return (
    <HeaderButton onPress={() => NavigationService.goBack()}>
      <Image source={ImageSource.arrowReturn} style={styles.backArrowStyle} />
    </HeaderButton>
  );
};

const DrawerButton = () => {
  return (
    <HeaderButton
      style={styles.drawerButtonStyle}
      onPress={() => NavigationService.openDrawer()}>
      <Icon type="Feather" name="menu" style={styles.drawerIconStyle} />
    </HeaderButton>
  );
};

const Header = (props: Props) => {
  const {canGoBack, canAccessDrawer, title, showSettingIcon} = props;
  const [isBellIconVisible, setIsBellIconVisible] = useState(false);

  const SettingButton = () => {
    return (
      <HeaderButton
        style={styles.drawerButtonStyle}
        onPress={props.visibleNotificationSetting}>
        <Icon type="Feather" name="settings" style={styles.drawerIconStyle} />
      </HeaderButton>
    );
  };
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeAreaStyle}>
      {/* In android remove statusbar background color */}
      <StatusBar backgroundColor="transparent" translucent />

      {/* Fill gradient in header background */}
      <LinearGradient
        colors={gradients.header}
        style={styles.absoluteFill}
        locations={[0.85, 1]}
      />

      <View style={styles.content}>
        {canGoBack && <BackButton />}

        {!canGoBack && (
          <>
            {!isBellIconVisible && (
              <Image
                source={ImageSource.logoIcon}
                style={styles.faceLogoStyle}
              />
            )}
            <NotificationIcon onNotificationCount={setIsBellIconVisible} />
          </>
        )}

        <Label numberOfLines={1} style={styles.titleStyle}>
          {title}
        </Label>

        {canAccessDrawer && <DrawerButton />}

        {showSettingIcon && <SettingButton />}
      </View>
    </SafeAreaView>
  );
};

export {Header};
