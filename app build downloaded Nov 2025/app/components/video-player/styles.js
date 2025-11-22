/**
 * Video Player Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  loadingContainer: {
    ...EStyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(230,235,255)',
  },
  reloadIconStyle: {
    fontSize: '50@ms',
    color: '$colors.primary',
  },
  appNameStyle: {
    fontSize: '36@ms',
    textAlign: 'center',
  },
  messageStyle: {
    fontSize: '27@ms',
    textAlign: 'center',
  },
  animationStyle: {
    width: '16%',
    paddingVertical: '5@ms',
  },
});
