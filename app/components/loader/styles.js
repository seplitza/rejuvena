/**
 * Loader Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

// Styles
export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageStyle: {
    fontSize: '18@ms',
    marginTop: '10@ms',
    color: '#fff',
  },
  lottieViewStyle: {
    height: '120@ms',
  },
});
