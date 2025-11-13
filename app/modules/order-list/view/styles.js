/**
 * Order List Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: '5@ms',
  },

  //product card styles
  cardStyle: {
    width: '100%',
    borderRadius: 0,
    marginTop: '4@ms',
    backgroundColor: '#F7F7F7',
  },
  cartContent: {
    width: '100%',
    maxWidth: '450@ms',
    alignSelf: 'center',
    padding: '10@ms',
    paddingHorizontal: '5@ms',
  },
  topSection: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: '120@ms',
    height: '120@ms',
    resizeMode: 'contain',
    margin: '4@ms',
  },
  imageTextStyle: {
    color: '$colors.primary',
    fontSize: '20@ms',
    fontFamily: '$fonts.PhosphateInline',
    marginTop: '4@ms',
  },
  strokeTextStyle: {
    fontSize: '25@ms',
    position: 'absolute',
    bottom: 0,
    color: '#fff',
    textShadowColor: '$colors.primary',
    textShadowRadius: 10,
  },
  detailSection: {
    flex: 1,
    marginLeft: '15@ms',
  },
  boldTextStyle: {
    color: '$colors.primary',
    fontSize: '18@ms',
    fontWeight: '600',
    marginTop: '4@ms',
  },
  textStyle: {
    color: '$colors.primary',
    fontSize: '15@ms',
    marginTop: '4@ms',
  },
  shiftBottom: {
    marginTop: 'auto',
  },
  bottomSection: {
    marginTop: '2@ms',
    flexDirection: 'row',
  },
  joinButtonStyle: {
    width: 'auto',
    minWidth: '140@ms',
    height: '40@ms',
    borderRadius: '20@ms',
  },
  joinButtonLabelStyle: {
    color: '#fff',
    fontSize: '22@ms',
    paddingHorizontal: '15@ms',
    marginTop: '-2@ms',
  },
  learnMoreButtonStyle: {
    minWidth: '120@ms',
    minHeight: '40@ms',
    width: 'auto',
    height: 'auto',
    borderWidth: 2,
    borderRadius: '20@ms',
    paddingHorizontal: '20@ms',
    borderColor: '$colors.primary',
    marginTop: 'auto',
    marginLeft: 'auto',
  },
  learMoreText: {
    color: '$colors.primary',
    fontSize: '22@ms',
    marginTop: '-2@ms',
  },
  finishedLabelStyle: {
    minWidth: '140@ms',
    color: '$colors.primary',
    fontWeight: 'bold',
    fontSize: '20@ms',
    textAlign: 'center',
    marginTop: '5@ms',
  },
});
