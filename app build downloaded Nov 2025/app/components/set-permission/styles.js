/**
 * Set Permission Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

// Styles
export const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$colors.primary',
    width: '100%',
    maxWidth: '340@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '40@ms',
    ...shadow,
    borderRadius: '8@ms',
  },
  titleStyle: {
    color: '#fff',
    paddingVertical: '14@ms',
    fontSize: '24@ms',
  },
  messageStyle: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: '14@ms',
    paddingHorizontal: '5@ms',
    fontSize: '14@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    width: '80%',
    height: '55@ms',
    borderRadius: '40@ms',
    marginVertical: '10@ms',
    alignSelf: 'center',
  },
  iconStyle: {
    fontSize: '40@ms',
    color: '#fff',
    paddingVertical: '20@ms',
  },
  iconContainer: {
    flexDirection: 'row',
  },
});
