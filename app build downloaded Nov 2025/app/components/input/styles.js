/**
 * Input Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    width: '80%',
    maxWidth: '400@ms', // Don't too much stretch
    height: '55@ms',
    borderRadius: '6@ms',
    marginVertical: '5@ms',
    paddingHorizontal: '5@ms',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  inputStyle: {
    flex: 1,
    color: '$colors.darkTextColor',
    fontSize: '22@ms',
    fontFamily: '$fonts.default',
    // Why: Custom font have default bottom
    // padding, text not showing in center properly
    marginTop: 2,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
    '@media ios': {
      width: '100%',
    },
  },
  errorBorderStyle: {
    borderColor: '$colors.errorColor',
  },
  errorStyle: {
    color: '$colors.errorColor',
    fontSize: '16@ms',
    textAlign: 'center',
  },
  eyeIconStyle: {
    position: 'absolute',
    fontSize: '22@ms',
    right: '15@ms',
    color: '$colors.primary',
  },
  placeholder: {
    color: 'rgb(170,170,170)',
  },
  selection: {
    color: '#007E9E',
  },
});
