/**
 * Voting Styles
 * @format
 */

import {EStyleSheet, vh} from '@app/styles';

// Styles for contest screen.
export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(247, 247, 247)',
  },
  headingNameStyle: {
    color: '$colors.primary',
    fontSize: '24@ms',
    textAlign: 'center',
    marginVertical: '10@ms',
  },
  arrowButtonStyle: {
    width: '50@ms',
    height: '50@ms',
    borderRadius: '25@ms',
    overflow: 'hidden',
  },
  arrowIconStyle: {
    width: '100%',
    height: '100%',
  },
  voteImage: {
    height: '60@ms',
    width: '60@ms',
  },
  tintColor: {
    tintColor: '$colors.primary',
  },
  footerContainerStyle: {
    alignSelf: 'center',
    bottom: '-5@ms',
  },
  userImage: {
    height: '89%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  ruleOfContestStyles: {
    color: '$colors.primary',
    fontSize: '25@ms',
    padding: '5@ms',
    textAlign: 'center',
  },
  rulesContentContainer: {
    paddingVertical: '20@ms',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  contestRulesStyles: {
    color: '$colors.primary',
    fontSize: '20@ms',
    padding: '12@ms',
    lineHeight: '28@ms',
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    paddingVertical: '10@ms',
  },
  labelStyle: {
    color: '$colors.primary',
    fontSize: '20@ms',
    textAlign: 'center',
    fontFamily: '$fonts.DINLight',
  },
  likeContainerStyle: {
    alignItems: 'center',
  },
  rulesIcon: {
    height: '30@ms',
    width: '30@ms',
  },
  emptyLabelStyle: {
    color: '$colors.primary',
    fontSize: '25@ms',
  },
  emptyLabelContainer: {
    ...EStyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieStyle: {
    height: '80@ms',
  },
  totalVoteStyle: {
    color: '$colors.textColor',
    fontSize: '24@ms',
    textAlign: 'center',
    marginTop: '-60@ms',
    width: '50@ms',
    height: '50@ms',
    borderRadius: '25@ms',
    backgroundColor: '$colors.primary',
  },
  prizeBoxImageStyle: {
    height: '48@ms',
    width: '48@ms',
    position: 'absolute',
    right: '10@ms',
    justifyContent: 'flex-end',
  },
  prizeAmountStyle: {
    color: '$colors.primary',
    fontSize: '18@ms',
    textAlign: 'center',
    top: '-6@ms',
  },
  actionSheetStyle: {
    height: vh * 88,
  },
});
