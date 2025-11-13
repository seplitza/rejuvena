/**
 * Heading Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '80@ms',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientStyle: {
    ...EStyleSheet.absoluteFill,
  },
  titleStyle: {
    color: '$colors.primary',
    fontSize: '36@ms',
    marginTop: '5@ms',
  },
});
