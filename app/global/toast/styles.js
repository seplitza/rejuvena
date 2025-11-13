/**
 * Toast Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    elevation: 999,
    alignSelf: 'center',
    zIndex: 1000,
    backgroundColor: '$colors.primary',
    borderRadius: '10@ms',
    padding: '10@ms',
  },
  textStyle: {
    color: '$colors.textColor',
    fontSize: '16@ms',
    textAlign: 'center',
  },
  default: {
    backgroundColor: '$colors.primary',
  },
  success: {
    backgroundColor: '#00C851',
  },
  error: {
    backgroundColor: '#ff4444',
  },
});
