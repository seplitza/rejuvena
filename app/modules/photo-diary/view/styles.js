/**
 * Photo Diary styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow, vh} from '@app/styles';

export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10@ms',
    justifyContent: 'space-between',
    width: '100%',
  },
  cameraIconStyle: {
    width: '40@ms',
    height: '40@ms',
    resizeMode: 'contain',
  },
  photoDiaryLabelStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
  },
  labelCenterStyle: {
    marginRight: 'auto',
    marginLeft: 'auto',
    left: '-20@ms',
  },
  photodiaryRuleButtonStyle: {
    borderColor: '$colors.primary',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    overflow: 'hidden',
  },
  rulesLabelStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    marginTop: '2@ms',
  },
  photoDiaryGuideLabelStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    marginHorizontal: '12@ms',
    lineHeight: '25@ms',
    marginBottom: '20@ms',
  },
  guideContainer: {
    ...shadow,
    shadowOffset: {height: 4, width: 0},
    backgroundColor: '#fff',
  },
  photoDiaryImagesContainer: {
    paddingBottom: '20@ms',
  },
  photodiaryHeaderStyle: {
    flexDirection: 'row',
    paddingTop: '5@ms',
    height: '50@ms',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '$colors.primary',
    fontSize: '22@ms',
    textAlign: 'center',
  },
  downloadCollageTextStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    textAlign: 'center',
    paddingRight: '20@ms',
  },
  disableStyle: {
    opacity: 0.5,
  },
  downloadCollageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10@ms',
  },
  imageSectionStyle: {
    flexDirection: 'row',
    zIndex: -1,
  },
  userRecordView: {
    width: '31%',
    height: '20@ms',
    backgroundColor: '#fff',
    borderRadius: '5@ms',
    marginHorizontal: '4@ms',
    justifyContent: 'center',
  },
  userRecordTextStyle: {
    color: '$colors.primary',
    fontSize: '18@ms',
    textAlign: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  userRecordValueView: {
    height: '25@ms',
    width: '36@ms',
    borderRadius: '5@ms',
    marginHorizontal: '11%',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  userRecordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '8@ms',
  },
  termsContainer: {
    alignItems: 'center',
    backgroundColor: '$colors.darkTextColor',
    paddingVertical: '16@ms',
    paddingHorizontal: '5@ms',
  },
  photoUploadRules: {
    color: 'white',
    fontSize: '17@ms',
    textAlign: 'center',
  },
  underlineRule: {
    color: 'white',
    fontSize: '17@ms',
    textDecorationLine: 'underline',
  },
  termsOverlay: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  downloadIconStyle: {
    fontSize: '45@ms',
    color: '$colors.primary',
  },
  takingPicMessageContainer: {
    backgroundColor: 'rgb(197,242,230)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6@ms',
    justifyContent: 'space-evenly',
  },
  iconContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  takingPicMessageStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.MPCond',
    textAlign: 'center',
  },
  horizontalPhoneIconStyle: {
    width: '64@ms',
    height: '32@ms',
    resizeMode: 'contain',
  },
  verticalPhoneIconStyle: {
    width: '23@ms',
    height: '46@ms',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  okIconStyle: {
    width: '28@ms',
    height: '28@ms',
    resizeMode: 'contain',
  },
  refuseIconStyle: {
    width: '40@ms',
    height: '40@ms',
    resizeMode: 'contain',
  },
  actionSheetStyle: {
    height: vh * 88,
  },

  // rules styles
  rulesContentContainer: {
    paddingVertical: '20@ms',
    backgroundColor: '#fff',
  },
  yesNoButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  yesNoButtonStyle: {
    flexDirection: 'row',
    borderRadius: '10@ms',
    borderWidth: '2@ms',
    borderColor: '$colors.primary',
    width: '32@vw',
    height: '46@ms',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  yesNoButtonDisableStyle: {
    opacity: 0.5,
  },
  yesNoLabel: {
    color: '$colors.primary',
    fontSize: '24@ms',
  },
  checkIconStyle: {
    width: '30@ms',
    height: '30@ms',
    position: 'absolute',
    left: '8@ms',
    tintColor: '$colors.primary',
  },
  ruleLabelStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    padding: '12@ms',
  },
  ruleLabelJustify: {
    textAlign: 'justify',
  },
  ruleLabelBold: {},
  ruleLabelLarge: {
    fontSize: '25@ms',
  },
  checkBoxAgreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '26@ms',
    marginBottom: '30@ms',
  },
  checkUnCheckIconStyle: {
    width: '46@ms',
    height: '46@ms',
    resizeMode: 'contain',
  },
  webViewStyle: {
    minHeight: '200@ms',
    width: '90%',
    alignSelf: 'center',
  },

  // Image confirmation popup styles
  imagePopupContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  confirmationImageStyle: {
    height: '375@ms',
    width: '100%',
    maxWidth: '420@ms',
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor: '#f1f1f1',
  },
  retakeOkButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: '30@ms',
  },
  retakeOkButtonTitle: {
    fontSize: '20@ms',
    padding: '16@ms',
  },
});

export const congratsPopupStyles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerButtonStyle: {
    margin: '5@ms',
    alignSelf: 'flex-end',
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  labelStyle: {
    fontSize: '22@ms',
    textAlign: 'center',
  },
  titleStyle: {
    color: '$colors.textColor',
    fontSize: '65@ms',
    textAlign: 'center',
  },
  congratsLabelStyle: {
    fontSize: '50@ms',
  },
  photoUploadMessage: {
    fontSize: '18@ms',
    textAlign: 'center',
    marginVertical: '24@ms',
    paddingHorizontal: '12%',
    lineHeight: '26@ms',
  },
  row: {
    flexDirection: 'row',
  },
  contentStyle: {
    flexDirection: 'row',
    marginLeft: '-50@ms',
    alignSelf: 'center',
  },
  whatYouAchievedLabelStyle: {
    marginTop: '10@ms',
    color: '$colors.textColor',
    fontSize: '18@ms',
  },
  inputStyle: {
    fontSize: '16@ms',
    color: 'rgb(0,25,107)',
  },
  inputContainerStyle: {
    height: '30@ms',
    width: '50@ms',
    backgroundColor: '#fff',
    borderRadius: '5@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  goalInputContainer: {
    height: 'auto',
    width: '100%',
    maxWidth: '340@ms',
    backgroundColor: '#fff',
    borderRadius: '10@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
    marginVertical: '10@ms',
    alignSelf: 'center',
  },
  likeIconStyle: {
    width: '40@ms',
    height: '40@ms',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: '10@ms',
  },
  closeIconStyle: {
    fontSize: '30@ms',
    color: '#fff',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  width: {
    width: '45%',
    color: '$colors.textColor',
  },
  unLikeStyle: {
    opacity: 0.4,
  },
  userRecordContentContainer: {
    marginTop: '10@ms',
  },
  buttonStyle: {
    height: '35@ms',
    width: '90@ms',
    alignSelf: 'center',
  },
  sizeBox: {
    height: '20@ms',
  },
});

export const collagePopupStyles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '320@ms',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingVertical: '8@ms',
    borderRadius: '8@ms',
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
    ...shadow,
  },
  avatar: {
    width: '100@ms',
    height: 'auto',
    aspectRatio: 1,
    marginVertical: '20@ms',
    resizeMode: 'contain',
  },
  labelStyle: {
    color: '$colors.textColor',
    textAlign: 'center',
    fontSize: '22@ms',
    lineHeight: '25@ms',
    marginBottom: '10@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    backgroundColor: '$colors.primary',
    borderRadius: '28@ms',
    ...shadow,
    elevation: 0,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: '20@ms',
  },
  noThanksLabelStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '20@ms',
    textAlign: 'center',
    lineHeight: '35@ms',
    textDecorationLine: 'underline',
    paddingVertical: '10@ms',
  },
});
