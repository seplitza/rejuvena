/**
 * Alert Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    ...EStyleSheet.absoluteFill,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertBox: {
    backgroundColor: '#efefef',
    width: '280@ms',
    maxWidth: '80@vw',
    paddingHorizontal: '15@ms',
    borderRadius: '10@ms',
    paddingTop: '20@ms',
    elevation: 5,
    shadowColor: 'rgba(0,0,0, 0.2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  titleStyle: {
    color: '#000',
    fontSize: '20@ms',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'System',
    marginBottom: '5@ms',
  },
  messageStyle: {
    color: '#222',
    fontSize: '15@ms',
    textAlign: 'center',
    fontFamily: 'System',
  },
  buttonContainer: {
    width: '100%',
    borderTopWidth: 0.8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: '20@ms',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    flex: 1,
    height: '45@ms',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabelStyle: {
    color: '$colors.primary',
    fontWeight: 'bold',
    fontSize: '18@ms',
  },
  success: {
    backgroundColor: '#00C851',
  },
  danger: {
    backgroundColor: '#ff4444',
  },
});
