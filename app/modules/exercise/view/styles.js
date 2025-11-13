/**
 * Marathon Exercise styles
 * @flow
 * @format
 */

import {EStyleSheet, shadow, moderateScale, isLandscape} from '@app/styles';

export const contentContainerStyle = () => ({
  flexGrow: 1,
  backgroundColor: '#fff',
  width: '100%',
  alignSelf: 'center',
  // minHeight: '90@vh', // To fix scroll issue
  ...(isLandscape() && {
    maxWidth: moderateScale(400),
  }),
});

export const styles = EStyleSheet.create({
  refreshControl: {
    color: '$colors.primary',
  },
  descriptionContainer: {
    zIndex: -1,
  },
  descriptionShadow: {
    ...shadow,
  },
  countdownMinHeight: {
    minHeight: '380@ms',
  },
  marathonDaysContainer: {
    flex: 1,
    zIndex: -1,
  },
  termsNotAcceptedMinHeight: {
    minHeight: '270@ms',
  },
  container: {
    flex: 1,
  },
  termsNotAcceptedContainer: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  termsNotAcceptedMessageStyle: {
    color: '#fff',
    fontSize: '34@ms',
    textAlign: 'center',
    marginTop: '40@ms',
    marginHorizontal: '10@ms',
    lineHeight: '40@ms',
  },
  panelContainer: {
    paddingTop: '40@ms',
  },
  subscribeMessageTextStyle: {
    lineHeight: '32@ms',
    textAlign: 'center',
    fontFamily: '$fonts.MPCond',
    fontSize: '22@ms',
    paddingHorizontal: '10@ms',
    color: '$colors.primary',
  },
  goodLuckTextStyle: {
    textAlign: 'center',
    fontFamily: '$fonts.MPCond',
    fontSize: '28@ms',
    paddingHorizontal: '10@ms',
    paddingVertical: '40@ms',
    color: '$colors.primary',
  },
});

// notification styles
export const notificationStyles = EStyleSheet.create({
  popoverStyle: {
    borderRadius: '14@ms',
    padding: '20@ms',
    borderColor: 'rgb(112,112,112)',
    borderWidth: 1,
    width: '85%',
    margin: 0,
  },
  popoverBackgroundStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  arrowStyle: {
    width: '25@ms',
    height: '25@ms',
  },
  closeIconStyle: {
    fontSize: '30@ms',
    color: '$colors.darkTextColor',
    padding: '5@ms',
    position: 'absolute',
  },
  textStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '13@ms',
    paddingTop: '10@ms',
    fontFamily: '$fonts.DINCondRegular',
    fontWeight: 'bold',
  },
  checkStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '13@ms',
    textDecorationLine: 'underline',
    fontFamily: '$fonts.DINCondRegular',
    fontWeight: 'bold',
  },
});

// Marathon header styles
export const headerStyles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: '15@ms',
    paddingVertical: '10@ms',
    ...shadow,
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
  },
  titleLabelStyle: {
    color: '$colors.primary',
    fontSize: '45@ms',
    top: 0,
    position: 'absolute',
  },
  dayValueStyle: {
    color: '$colors.primary',
    fontSize: '75@ms',
    fontFamily: '$fonts.PhosphateInline',
    marginBottom: '-16@ms',
  },
  productNameStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
  },
  dayLabelStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    marginTop: 'auto',
    paddingHorizontal: '4@ms',
  },
  rightContent: {
    alignItems: 'flex-end',
    paddingRight: '4@ms',
  },
  userImageStyle: {
    width: '30@ms',
    height: '30@ms',
    borderRadius: '15@ms',
    overflow: 'hidden',
  },
  dateStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    marginTop: '2@ms',
  },
});

// Description styles
export const descriptionStyles = EStyleSheet.create({
  container: {
    maxHeight: '380@ms',
    backgroundColor: '#fff',
    marginBottom: '4@ms',
  },
  scrollViewStyle: {
    paddingBottom: '80@ms',
  },
  webViewContainer: {
    minHeight: 20,
    paddingTop: '10@ms',
  },
  webViewStyle: {
    marginLeft: '20@ms',
    marginVertical: '20@ms',
    width: '92%',
  },
  featherEffectStyle: {
    position: 'absolute',
    width: '100%',
    height: '50@ms',
    bottom: 0,
    zIndex: 100,
  },
});

export const htmlStartTextStyles = `
<head>
  <style>
    * {
      color: #00259E;
      font-family: DINProCondensed-Bold;
      font-size: ${moderateScale(20)}px !important;
      line-height: ${moderateScale(22)}px !important;
    }
    span {
      color: rgb(170,170,170);
    }
  </style>
</head>
`;

export const htmlDayTextStyles = `
<head>
  <style>
    * {
      color: #00259E;
      font-family: DINProCondensed;
      font-size: ${moderateScale(20)}px !important;
      line-height: ${moderateScale(22)}px !important;
    }
    span {
      color: rgb(170,170,170);
    }
  </style>
</head>
`;

// Regulation styles
export const regulationStyles = EStyleSheet.create({
  contentContainer: {
    zIndex: -1,
  },
  collapsibleStyle: {
    flex: 1,
  },
  agreeRulesContainer: {
    backgroundColor: '#c1cef4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '25@ms',
    paddingHorizontal: '20@ms',
    borderTopWidth: '1@ms',
    borderColor: '#abb7db',
  },
  agreeRulesLabel: {
    color: '$colors.primary',
    fontSize: '24@ms',
    marginLeft: '20@ms',
  },
  checkBoxContainer: {
    borderRadius: '5@ms',
    overflow: 'hidden',
  },
  checkBoxImgStyle: {
    width: '46@ms',
    height: '46@ms',
    resizeMode: 'stretch',
  },
  closeIconStyle: {
    fontSize: '32@ms',
    color: '$colors.textColor',
    position: 'absolute',
    bottom: '4@ms',
  },
});

// Marathon days list styles
export const marathonDaysStyle = EStyleSheet.create({
  $dayHeight: '116@ms',
  container: {
    flex: 1,
    flexWrap: 'wrap-reverse',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    marginHorizontal: '-1%',
    marginBottom: '10@ms',
  },
  startContainer: {
    height: '$dayHeight',
    width: '64.67%',
    margin: '1%',
    padding: '10@ms',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: '10@ms',
    borderWidth: '3@ms',
    borderColor: '$colors.primary',
  },
  dayContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekValueStyle: {
    fontFamily: '$fonts.PhosphateInline',
    fontSize: '56@ms',
    color: '$colors.primary',
    marginTop: 'auto',
    marginBottom: '-10@ms',
  },
  startLabelStyle: {
    fontSize: '30@ms',
    color: '$colors.primary',
    marginTop: 'auto',
  },
  subsAgainMessageStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    textAlign: 'center',
    padding: '3@ms',
  },
  dayContainer: {
    height: '$dayHeight',
    width: '31.33%',
    margin: '1%',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: '10@ms',
    borderWidth: '3@ms',
    borderColor: '$colors.primary',
  },
  oldGEContainer: {
    height: '108@ms',
    width: '31.33%',
    overflow: 'hidden',
    marginLeft: '-3@ms',
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: '34@ms',
    borderTopRightRadius: '10@ms',
    borderWidth: '3@ms',
    borderColor: '$colors.primary',
    backgroundColor: 'rgb(230,235,255)',
    justifyContent: 'center',
  },
  oldGEContentContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: '15@ms',
    marginTop: '-8@ms',
    marginRight: '-4%',
    zIndex: -1,
  },
  oldGEPracticeCourseTextStyle: {
    color: '$colors.textColor',
    fontSize: '28@ms',
    position: 'absolute',
    right: '6@ms',
    bottom: '20@ms',
    textShadowColor: '$colors.primary',
    textShadowRadius: '10@ms',
  },
  oldGEPracticeCourseNumStyle: {
    fontSize: '56@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.PhosphateInline',
    textAlign: 'right',
    paddingRight: '32%',
    paddingTop: '15@ms',
  },
  activeDayBackgroundColor: {
    backgroundColor: 'rgb(230,235,255)',
  },
  dayLabel: {
    color: '$colors.primary',
    fontSize: '24@ms',
    marginTop: 'auto',
    marginBottom: '8@ms',
    padding: '4@ms',
  },
  dayValueStyle: {
    fontSize: '56@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.PhosphateInline',
    marginTop: 'auto',
    marginRight: 'auto',
  },
  weekDivider: {
    height: '20@ms',
    width: '100%',
  },
  extensionDescriptionBarStyle: {
    width: '98%',
    padding: '6@ms',
    margin: '1%',
    borderColor: '$colors.primary',
    borderWidth: '3@ms',
    borderRadius: '10@ms',
    backgroundColor: 'rgb(230, 235, 255)',
  },
  extensionDescriptionLabelStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '24@ms',
    textAlign: 'center',
    fontFamily: '$fonts.MPBoldCond',
    lineHeight: '35@ms',
  },
  lastSelfieDateStyle: {
    fontFamily: '$fonts.MPCond',
    color: 'rgb(0,25,107)',
    fontSize: '25@ms',
    textAlign: 'center',
    lineHeight: '35@ms',
  },
  extensionDescriptionBarContent: {
    textAlign: 'center',
  },
  fontFamily: {
    fontFamily: '$fonts.MPCond',
  },
  goPhotoDiaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowStyle: {
    height: '35@ms',
    width: '35@ms',
    marginHorizontal: '10@ms',
    resizeMode: 'contain',
  },
  tooltipTextStyle: {
    fontFamily: '$fonts.MPCond',
    fontSize: '25@ms',
    color: '$colors.primary',
    lineHeight: '26@ms',
  },
  popoverStyle: {
    backgroundColor: 'rgb(197,242,230)',
    borderColor: '$colors.primary',
    borderWidth: 1,
    borderRadius: '10@ms',
    borderBottomColor: '$colors.primary',
    padding: '15@ms',
  },
  popoverArrowStyle: {
    backgroundColor: 'rgb(197,242,230)',
    height: '18@ms',
  },
  fiveStarImageStyle: {
    width: '50@ms',
    height: '50@ms',
    position: 'absolute',
    top: '5@ms',
    left: '5@ms',
  },
});

// Day plan & day category styles
export const dayPlanStyles = EStyleSheet.create({
  contentContainer: {
    zIndex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: '80@ms',
    width: '100%',
    zIndex: -1,
  },
  categoryIconStyle: {
    width: '44@ms',
    height: '44@ms',
    resizeMode: 'contain',
    marginHorizontal: '10@ms',
    position: 'absolute',
  },
  categoryNameStyle: {
    flex: 1,
    fontSize: '22@ms',
    padding: '10@ms',
    color: '$colors.primary',
    textAlign: 'center',
    marginHorizontal: '45@ms',
  },
  headerContainer: {
    minHeight: '55@ms',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgb(197,242,230)',
  },
  blockBorderColor: {
    borderColor: '#fff',
  },
  checkIconContainer: {
    width: '55@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconStyle: {
    width: '34@ms',
    height: '34@ms',
    tintColor: 'rgba(105,105,105,.3)',
  },
  checkActiveStyle: {
    tintColor: '$colors.primary',
  },
  textOpacityStyle: {
    opacity: 0.5,
  },
  exerciseNameContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: '5@ms',
    paddingLeft: '10@ms',
  },
  exerciseNameStyle: {
    fontSize: '21@ms',
    color: '$colors.primary',
  },
  minDescriptionStyle: {
    fontSize: '18@ms',
    color: '$colors.primary',
    fontFamily: '$fonts.DINCondRegular',
    paddingRight: '20@ms',
  },
  upDownIconStyle: {
    fontSize: '25@ms',
    position: 'absolute',
    right: '5@ms',
    color: '$colors.primary',
  },
  closeIconContainer: {
    backgroundColor: '$colors.primary',
    alignItems: 'center',
    paddingVertical: '4@ms',
    width: '100%',
  },
  closeIconStyle: {
    fontSize: '30@ms',
    color: '$colors.textColor',
  },
  loadingIconStyle: {
    transform: [{rotate: '5deg'}],
  },
  newExerciseContainer: {
    marginTop: '20@ms',
  },
});

// Exercise styles
export const exerciseStyles = EStyleSheet.create({
  swiper: {
    width: '100%',
    aspectRatio: 1,
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
  gifContainer: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: 'rgb(242,242,242)',
  },
  contentImageStyle: {
    flex: 1,
  },
  tapForVideoTextStyle: {
    color: 'rgb(170,170,170)',
    paddingTop: '25@ms',
    position: 'absolute',
    alignSelf: 'center',
    fontSize: '24@ms',
    fontFamily: '$fonts.DINLight',
  },
  arrowIconStyle: {
    width: '35@ms',
    height: '35@ms',
    resizeMode: 'contain',
    tintColor: 'rgb(170,170,170)',
  },
  descriptionContent: {
    marginVertical: '20@ms',
    width: '90%',
    alignSelf: 'center',
  },
  closeIcon: {
    fontSize: '30@ms',
    color: '$colors.primary',
    marginLeft: 'auto',
    margin: '20@ms',
  },
  tintColor: {
    tintColor: '#fff',
  },
  forwardIconStyle: {
    width: '42@ms',
    height: '42@ms',
    resizeMode: 'contain',
  },
  imageStyle: {
    width: '55@ms',
    height: '55@ms',
    resizeMode: 'contain',
  },
  dayExerciseContainer: {
    flexDirection: 'row',
    borderBottomWidth: '8@ms',
    borderColor: '$colors.primary',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dayExerciseContainerOddStyle: {
    backgroundColor: '$colors.primary',
  },
  exerciseNumberLabelStyle: {
    color: '$colors.primary',
    fontSize: '32@ms',
    paddingTop: '40@ms',
    paddingHorizontal: '16@ms',
  },
  newLabelStyle: {
    color: '$colors.primary',
    fontSize: '15@ms',
  },
  exerciseNumberLabelOddStyle: {
    color: '#fff',
  },
  exerciseDetailContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: '240@ms',
    height: '240@ms',
    margin: '15@ms',
    alignSelf: 'center',
  },
  videoStyle: {
    width: '100%',
    height: '100%',
  },
  exerciseNameStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
    paddingHorizontal: '20@ms',
  },
  exerciseDescriptionStyle: {
    height: '80@ms',
    paddingHorizontal: '20@ms',
    overflow: 'hidden',
  },
  exeVidImageStyle: {
    width: '50@ms',
    height: '50@ms',
    position: 'absolute',
    right: 0,
    bottom: '-25@ms',
    tintColor: '$colors.primary',
  },
  headerLabelStyle: {
    fontSize: '22@ms',
    color: '$colors.primary',
    width: '60%',
    textAlign: 'center',
  },
  descriptionHeader: {
    flexDirection: 'row',
    minHeight: '70@ms',
    padding: '10@ms',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  descriptionHeaderTitleStyle: {
    fontSize: '22@ms',
    width: '60%',
    textAlign: 'center',
  },
});

// Comment section styles
export const commentStyles = EStyleSheet.create({
  scrollViewStyle: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: '20@ms',
  },
  noCommentsYet: {
    flex: 1,
    textAlign: 'center',
    color: '$colors.primary',
    fontSize: '25@ms',
    top: '-80@ms',
  },
  commentContainer: {
    flexDirection: 'row',
    padding: '10@ms',
  },
  closeIcon: {
    fontSize: '20@ms',
    color: '$colors.darkTextColor',
  },
  replyingToContainer: {
    flexDirection: 'row',
    height: '40@ms',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10@ms',
    backgroundColor: '#efefef',
  },
  replyingToStyle: {
    color: '$colors.darkTextColor',
    fontSize: '18@ms',
    fontFamily: '$fonts.DINLight',
  },
  profilePictureContainer: {
    height: '34@ms',
    width: '34@ms',
    borderRadius: '17@ms',
    backgroundColor: '$colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nameInitialStyle: {
    position: 'absolute',
    color: '#fff',
    fontSize: '18@ms',
  },
  profileImageStyle: {
    width: '100%',
    height: '100%',
  },
  commentDetail: {
    flex: 1,
    marginLeft: '10@ms',
  },
  adminAnswerStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '14@ms',
    fontFamily: '$fonts.ArialBoldItalicMT',
  },
  userQuestionStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '14@ms',
    fontFamily: '$fonts.ArialItalicMT',
  },
  recipientNameStyle: {
    color: '#000',
  },
  userNameStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '16@ms',
    fontFamily: '$fonts.default',
  },
  replyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5@ms',
  },
  replyLabelStyle: {
    color: '$colors.secondaryTextColor',
    fontSize: '15@ms',
    marginRight: '30@ms',
  },
  iconStyle: {
    fontSize: '16@ms',
    color: '$colors.secondaryTextColor',
  },
  activeIconStyle: {
    color: '$colors.primary',
  },
  replyInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderColor: '$colors.darkTextColor',
    borderTopWidth: 0.5,
  },
  inputContainerStyle: {
    flex: 1,
    height: '70@ms',
    padding: '5@ms',
    maxWidth: 'auto',
  },
  inputStyle: {
    textAlign: 'left',
    fontSize: '14@ms',
  },
  messageIconStyle: {
    width: '35@ms',
    height: '35@ms',
    resizeMode: 'contain',
    margin: '5@ms',
  },
  disableMessageIconStyle: {
    opacity: 0.5,
  },
  seeAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '10@ms',
  },
  seeAnswerLabelStyle: {
    color: '$colors.secondaryTextColor',
    fontSize: '15@ms',
  },
  activityIndicator: {
    color: '$colors.darkTextColor',
  },
  childCommentSection: {
    marginLeft: '20@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameAndMessageSection: {
    width: '94%',
  },
  tabsContainerStyle: {
    margin: '6@ms',
    height: '26@ms',
    borderRadius: '13@ms',
    borderColor: '$colors.primary',
    borderWidth: 1,
    overflow: 'hidden',
    width: '65%',
    maxWidth: '300@ms',
  },
  tabStyle: {
    borderWidth: 0,
  },
  tabTextStyle: {
    fontFamily: '$fonts.default',
    color: '$colors.primary',
    fontSize: '15@ms',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  activeTabStyle: {
    backgroundColor: '$colors.primary',
  },
});

// Feedback popup styles
export const feedbackPopupStyles = EStyleSheet.create({
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
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  logoStyle: {
    height: '100@ms',
    width: '100@ms',
    resizeMode: 'contain',
  },
  titleStyle: {
    color: '$colors.primary',
    fontSize: '24@ms',
    paddingVertical: '20@ms',
    textAlign: 'center',
  },
  feedbackMessageStyle: {
    color: '$colors.secondaryTextColor',
    fontSize: '22@ms',
    textAlign: 'center',
    fontFamily: '$fonts.MPCond',
    paddingBottom: '20@ms',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '150@ms',
    justifyContent: 'space-between',
    marginLeft: 'auto',
  },
  buttonTitleStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
  },
});

// Description comments tab styles
export const descriptionCommentTabStyles = EStyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainerStyle: {
    backgroundColor: '$colors.primary',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    height: '80@ms',
    ...shadow,
  },
  tabStyle: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTitleStyle: {
    color: '$colors.textColor',
    fontSize: '20@ms',
  },
  tabIconStyle: {
    width: '24@ms',
    height: '24@ms',
    alignSelf: 'center',
    tintColor: '#fff',
  },
  descriptionHeader: {
    flexDirection: 'row',
    minHeight: '70@ms',
    padding: '10@ms',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  descriptionHeaderTitleStyle: {
    fontSize: '22@ms',
    width: '70%',
    textAlign: 'center',
  },
  imageStyle: {
    width: '55@ms',
    height: '55@ms',
    resizeMode: 'contain',
    position: 'absolute',
    left: '10@ms',
  },
  opacity: {
    opacity: 0.6,
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
  },
});

export const rulesHtmlStyles = `
  body {
    background-color: #D7E2FF;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }  
  li {
    background-color: rgb(230,235,255);
    padding: ${moderateScale(18)} !important;
    font-size: ${moderateScale(20)} !important;
    color: rgb(0,25,107);
    font-family: DINProCondensed-Bold !important;
  }
  li:first-child {
    padding-top:  ${moderateScale(22)} !important;
    
  }
  li:nth-child(even) {
    background-color: #fff;
  }`;

export const acceptedRulesHtmlStyles = `
  body {
    background-color: #00259E;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }  
  li {
    background-color: #00259E;
    padding: ${moderateScale(18)} !important;
    font-size: ${moderateScale(20)} !important;
    color: #fff;
    font-family: DINProCondensed-Bold !important;
  }
  li:first-child {
    padding-top:  ${moderateScale(22)};
  }
  li:nth-child(even) {
    background-color: #00259E;
  }`;

export const htmlDescriptionStyles = `
<head>
  <style>
    * {
      font-family: DINProCondensed !important;
      font-size: ${moderateScale(20)}px !important;
      line-height: ${moderateScale(23)}px !important;
      color: rgb(0,25,107) ! important;
    }
  </style>
</head>
`;

export const iframeCustomStyle = `
iframe {
  display: block;
  margin-right: auto;
  margin-left: auto;
}
`;
