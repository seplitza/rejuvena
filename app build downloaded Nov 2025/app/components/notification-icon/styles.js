/**
 * Notification Icon Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  notificationIconStyle: {
    height: '35@ms',
    width: '35@ms',
  },
  popoverStyle: {
    borderRadius: '15@ms',
    borderColor: '#707070',
    borderWidth: '1@ms',
  },
  backgroundStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    padding: '12@ms',
    maxWidth: '400@ms',
  },
  notificationLabelStyle: {
    fontSize: '18@ms',
    color: '#101e57',
    fontFamily: '$fonts.MPCond',
    paddingVertical: '5@ms',
  },
  checkLabelStyle: {
    textDecorationLine: 'underline',
  },
  countContainer: {
    position: 'absolute',
    right: '-5@ms',
    backgroundColor: '#fff',
    height: '20@ms',
    width: '20@ms',
    borderRadius: '10@ms',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: '18@ms',
    color: '#555',
    marginTop: '2@ms',
  },
});
