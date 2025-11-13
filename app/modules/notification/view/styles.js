/**
 * Notification Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

export const styles = EStyleSheet.create({
  listContainerStyle: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '5@ms',
  },
  emptyPlaceholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshControl: {
    color: '$colors.primary',
  },
  arrowIconStyle: {
    fontSize: '25@ms',
    position: 'absolute',
    right: '5@ms',
    top: 0,
    color: '$colors.primary',
  },
  notificationIconStyle: {
    height: '250@ms',
    width: '250@ms',
    resizeMode: 'contain',
  },
  noNotifLabelStyle: {
    color: '$colors.primary',
    fontSize: '25@ms',
    marginTop: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  notificationContainer: {
    ...shadow,
    backgroundColor: '#fff',
    margin: '5@ms',
    marginHorizontal: '10@ms',
    padding: '10@ms',
    borderRadius: '5@ms',
    minHeight: '90@ms',
  },
  notificationContainerOld: {
    backgroundColor: '#ededed',
    shadowOpacity: 0.2,
    elevation: 2,
  },
  notificationTitleStyle: {
    fontFamily: '$fonts.MPBoldCond',
    fontSize: '17@ms',
    color: '$colors.primary',
    paddingRight: '25@ms',
  },
  notificationMsgStyle: {
    fontSize: '16@ms',
    color: '$colors.primary',
    marginVertical: '5@ms',
  },
  notificationTimeStyle: {
    fontSize: '14@ms',
    color: '$colors.primary',
    marginTop: 'auto',
  },
  deleteViewStyle: {
    width: '65@ms',
    backgroundColor: '#e30000',
    position: 'absolute',
    right: '2@ms',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  iconStyle: {
    fontSize: '22@ms',
    color: '#fff',
  },
  notificationImage: {
    marginVertical: '10@ms',
    height: '200@ms',
  },
  deleteButton: {
    width: '-60@ms',
  },
  notificationSettingContainerStyles: {
    zIndex: 1,
    ...shadow,
    elevation: 8,
    top: '-2@ms',
  },
});

export const notificationStyles = EStyleSheet.create({
  headingContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    paddingVertical: '20@ms',
    paddingHorizontal: '10@ms',
    backgroundColor: '#fff',
    borderBottomLeftRadius: '35@ms',
    borderBottomRightRadius: '35@ms',
  },
  labelStyle: {
    color: '$colors.primary',
    fontSize: '24@ms',
  },
  bottomContainerStyle: {
    marginVertical: '10@ms',
  },
  remainderContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20@ms',
  },
  buttonStyle: {
    width: '50@ms',
    height: '20@ms',
    borderRadius: '30@ms',
    borderWidth: '1@ms',
    borderColor: '$colors.primary',
    marginRight: '20@ms',
  },
  buttonTitleStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.default',
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayContainerStyle: {
    width: '46@ms',
    height: '24@ms',
    borderRadius: '24@ms',
    borderWidth: '1@ms',
    borderColor: '$colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '2@ms',
  },
  selectedDayContainerStyle: {
    backgroundColor: '$colors.primary',
    flexDirection: 'row',
  },
  dayLabelStyle: {
    fontSize: '14@ms',
    color: '$colors.primary',
  },
  selectedDayLabelStyle: {
    color: '#fff',
  },
  weekdayContainerStyle: {
    flexDirection: 'row',
    marginTop: '10@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    opacity: 0.2,
  },
  iconStyle: {
    fontSize: '14@ms',
    color: '#fff',
  },
});

export const timePickerPopupStyles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '340@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: '20@ms',
    borderRadius: '8@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
    ...shadow,
  },
  titleStyle: {
    color: '$colors.secondaryTextColor',
    fontSize: '22@ms',
    alignSelf: 'flex-start',
  },
  dividerStyles: {
    height: '1@ms',
    width: '100%',
    backgroundColor: '$colors.secondaryTextColor',
    marginTop: '10@ms',
  },
  buttonContainerStyles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '100@ms',
  },
  buttonStyle: {
    width: 'auto',
    height: '35@ms',
    paddingHorizontal: '20@ms',
    marginTop: '10@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonTitleStyle: {
    color: '$colors.secondaryTextColor',
    fontSize: '22@ms',
  },
});
