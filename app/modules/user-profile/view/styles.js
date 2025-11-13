/**
 * User Profile Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingContainerStyle: {
    ...shadow,
    shadowOpacity: 0.5,
  },
  headingTitleStyle: {
    fontFamily: '$fonts.default',
    fontSize: '22@ms',
  },
  section: {
    alignItems: 'center',
    paddingTop: '10@ms',
    paddingBottom: '40@ms',
  },
  labelStyle: {
    color: '$colors.darkTextColor',
    fontSize: '18@ms',
    marginTop: '10@ms',
    textAlign: 'center',
  },
  emailLabelStyle: {
    color: '$colors.primary',
  },
  formContainer: {
    width: '70%',
    maxWidth: '300@ms',
    marginTop: '10@ms',
    alignItems: 'center',
  },
  inputContainerStyle: {
    height: '40@ms',
    borderRadius: '20@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  inputStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
  },
  tabsContainerStyle: {
    marginTop: '5@ms',
    height: '40@ms',
    borderRadius: '20@ms',
    borderColor: '$colors.primary',
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabStyle: {
    borderWidth: 0,
  },
  tabTextStyle: {
    fontFamily: '$fonts.default',
    color: '$colors.primary',
    fontSize: '18@ms',
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginTop: '2@ms',
  },
  activeTabStyle: {
    backgroundColor: '$colors.primary',
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginTop: '20@ms',
  },
  profilePictureStyle: {
    height: '130@ms',
    width: '130@ms',
    borderRadius: '65@ms',
    overflow: 'hidden',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '40@ms',
    height: '40@ms',
    borderRadius: '20@ms',
    backgroundColor: '$colors.primary',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  cameraIconStyle: {
    color: '#fff',
    fontSize: '25@ms',
  },
  buttonStyle: {
    width: null,
    height: '46@ms',
    minWidth: '210@ms',
    borderRadius: '10@ms',
    alignSelf: 'center',
    marginTop: '10@ms',
    ...shadow,
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: '22@ms',
    textAlign: 'center',
    padding: '10@ms',
  },
  deleteButtonStyle: {
    backgroundColor: 'grey',
    width: null,
    height: '46@ms',
    minWidth: '210@ms',
    borderRadius: '10@ms',
    alignSelf: 'center',
    marginVertical: '20@ms',
    ...shadow,
  },
  deleteButtonTitleStyle: {
    color: '#fff',
    fontSize: '22@ms',
    textAlign: 'center',
    padding: '10@ms',
  },
});

export const deleteAccountPopupStyles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '350@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '25@ms',
    paddingHorizontal: '15@ms',
    ...shadow,
    borderRadius: '15@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  titleStyle: {
    color: '#000',
    fontSize: '28@ms',
    textAlign: 'center',
    paddingVertical: '20@ms',
  },
  messageStyle: {
    color: '#000',
    fontSize: '20@ms',
    textAlign: 'center',
    lineHeight: '30@ms',
    paddingVertical: '20@ms',
  },
  buttonStyle: {
    borderRadius: '28@ms',
    borderColor: 'rgba(255, 0, 0,.8)',
    borderWidth: 2,
  },
  noThankLabelStyle: {
    color: '#000',
    fontSize: '20@ms',
    lineHeight: '32@ms',
    textDecorationLine: 'underline',
  },
  buttonTitleStyle: {
    color: 'rgba(255, 0, 0,.8)',
    fontSize: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
});
