/**
 * New Update Available Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

// Styles
export const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '20@ms',
    ...shadow,
  },
  labelStyle: {
    fontFamily: '$fonts.MPCond',
    fontSize: '24@ms',
    padding: '15@ms',
    textAlign: 'center',
    color: '$colors.primary',
  },
  logoStyle: {
    width: '220@ms',
    height: '100@ms',
    resizeMode: 'contain',
  },
  buttonStyle: {
    marginVertical: '10@ms',
    backgroundColor: '$colors.primary',
  },
  titleStyle: {
    fontSize: '24@ms',
    padding: '15@ms',
    textAlign: 'center',
    color: '#fff',
  },
});
