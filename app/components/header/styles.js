/**
 * Header Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

export const styles = EStyleSheet.create({
  safeAreaStyle: {
    zIndex: 100,
    ...shadow,
    elevation: 8,
    borderBottomWidth: 0.1,
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
  content: {
    height: '50@ms',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10@ms',
  },
  backArrowStyle: {
    height: '30@ms',
    width: '30@ms',
    resizeMode: 'contain',
    tintColor: '#00259E',
  },
  titleStyle: {
    position: 'absolute',
    right: '50@ms',
    fontSize: '26@ms',
    color: '$colors.primary',
    left: '45@ms',
    textAlign: 'center',
  },
  drawerButtonStyle: {
    marginLeft: 'auto',
  },
  drawerIconStyle: {
    fontSize: '32@ms',
    color: '$colors.primary',
  },
  faceLogoStyle: {
    height: '42@ms',
    width: '42@ms',
    resizeMode: 'contain',
  },
  animationStyle: {
    height: '80%',
  },
});
