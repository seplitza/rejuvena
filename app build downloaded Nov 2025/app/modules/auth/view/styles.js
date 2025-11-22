/**
 * Auth Styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow} from '@app/styles';

export const styles = EStyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: '40@ms',
  },
  languagePickerContainerStyle: {
    marginVertical: '10@ms',
    width: '90%',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
  title: {
    fontSize: '60@ms',
    textAlign: 'center',
  },
  appName: {
    fontSize: '35@ms',
  },
  appTagName: {
    fontSize: '20@ms',
    marginBottom: '30@ms',
    textAlign: 'center',
  },
  label: {
    fontSize: '22@ms',
    textAlign: 'center',
  },
  caption: {
    fontSize: '22@ms',
    width: '80%',
    maxWidth: '400@ms',
    marginTop: '20@ms',
  },
  orSignInWithLabel: {
    fontSize: '22@ms',
    textAlign: 'center',
    paddingTop: '30@ms',
  },
  termsAndPrivacyTextStyle: {
    fontSize: '16@ms',
    textAlign: 'center',
  },
  termsAndConditionsContainerStyle: {
    paddingVertical: '15@ms',
  },
  sizeBox: {
    height: '10@ms',
  },
  paddingTop: {
    paddingTop: '80@ms',
  },
  termsAndPrivacyUnderline: {
    textDecorationLine: 'underline',
  },
  underline: {
    textDecorationLine: 'underline',
    lineHeight: '50@ms',
  },
  joinAndLoginTextStyle: {
    fontSize: '38@ms',
    lineHeight: '54@ms',
    textDecorationLine: 'underline',
  },
  paddingVertical: {
    paddingVertical: '10@ms',
  },
  buttonTitleStyle: {
    width: '200@ms',
  },
  socialSignInButtonContainer: {
    flexDirection: 'row',
    width: '83%',
    maxWidth: '415@ms',
    marginTop: '10@ms',
  },
  socialSignInButtonStyle: {
    flex: 1,
    marginHorizontal: '10@ms',
  },
  stepperStyle: {
    height: '10@ms',
    backgroundColor: '$colors.textColor',
    width: '80%',
    maxWidth: '400@ms',
    borderRadius: '5@ms',
  },
  stepperFillStyle: {
    height: '10@ms',
    backgroundColor: '$colors.primary',
    borderRadius: '5@ms',
  },
  buttonContainerStyle: {
    marginTop: '40@ms',
  },
});

export const guestUserStyles = EStyleSheet.create({
  imageStyle: {
    height: '120@ms',
    width: '120@ms',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerCupIconStyle: {
    height: '60@ms',
    width: '60@ms',
  },
  guestMessageAndImageStyle: {
    padding: '10@ms',
    width: '96%',
    maxWidth: '400@ms',
    backgroundColor: '#fff',
    marginVertical: '30@ms',
    ...shadow,
    borderRadius: '22@ms',
    justifyContent: 'center',
  },
  messageStyle: {
    fontSize: '20@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.DINLight',
    textAlign: 'left',
    marginLeft: '115@ms',
  },
  marginTop: {
    marginTop: '-6@ms',
  },
  boldMessageStyle: {
    fontSize: '20@ms',
    color: '$colors.primary',
    textDecorationLine: 'underline',
    lineHeight: '30@ms',
    marginTop: '-6@ms',
    marginLeft: '115@ms',
  },
  availableCourseStyle: {
    fontSize: '25@ms',
    fontFamily: '$fonts.DINLight',
  },
  buttonContainerStyle: {
    backgroundColor: '$colors.primary',
    margin: '20@ms',
  },
  buttonTitleStyle: {
    color: '$colors.textColor',
  },
  demoCourseIconStyle: {
    flex: 1,
  },
  courseIconStyle: {
    height: '54%',
    width: '54%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  courseImageContainerStyle: {
    height: '160@ms',
    width: '160@ms',
    backgroundColor: '#fff',
    margin: '10@ms',
    borderRadius: '22@ms',
    justifyContent: 'space-around',
  },
  borderStyle: {
    borderColor: 'rgb(197,242,230)',
    borderWidth: '2@ms',
  },
  titleStyle: {
    fontSize: '20@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.DINLight',
    textAlign: 'center',
  },
  subTitleStyle: {
    fontSize: '16@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.DINLight',
    textAlign: 'center',
  },
  courseListStyle: {
    marginVertical: '10@ms',
  },
  drawerButtonStyle: {
    position: 'absolute',
    right: '10@ms',
  },
  drawerIconStyle: {
    fontSize: '32@ms',
    color: '$colors.textColor',
  },
});
