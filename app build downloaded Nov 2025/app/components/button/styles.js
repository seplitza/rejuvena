/**
 * Button Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    width: '80%',
    maxWidth: '400@ms',
    height: '55@ms',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6@ms',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: '5@ms',
    flexDirection: 'row',
  },
  titleStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  loading: {
    color: '$colors.textColor',
  },
  disableStyle: {
    opacity: 0.5,
  },
  icon: {
    width: '34@ms',
    height: '34@ms',
    resizeMode: 'contain',
  },
  gradientStyle: {
    ...EStyleSheet.absoluteFill,
  },
});
