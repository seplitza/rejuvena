/**
 * Loader Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    ...EStyleSheet.absoluteFill,
    elevation: 1000,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
  },
  lottieStyle: {
    height: '120@ms',
  },
});
