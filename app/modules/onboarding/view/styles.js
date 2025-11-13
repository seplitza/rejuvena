/**
 * OnBoarding Styles
 * @flow
 * @format
 */
import {isTablet} from 'react-native-device-info';

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentStyle: {
    flex: 1,
    alignSelf: 'center',
    maxWidth: '400@ms',
    width: '100%',
    justifyContent: 'space-between',
  },
  headingStyle: {
    fontSize: '36@ms',
    ...(!isTablet() && {
      paddingHorizontal: '16@ms',
      alignSelf: 'flex-start',
    }),
  },
  captionStyle: {
    fontSize: '22@ms',
    marginTop: '10@ms',
    ...(!isTablet() && {
      paddingHorizontal: '16@ms',
      alignSelf: 'flex-start',
    }),
  },
  dotStyle: {
    backgroundColor: '$colors.textColor',
    width: '10@ms',
    height: '10@ms',
    borderRadius: '5@ms',
    marginHorizontal: '5@ms',
  },
  activeDotStyle: {
    backgroundColor: '$colors.textColor',
    width: '18@ms',
    height: '18@ms',
    borderRadius: '9@ms',
    marginHorizontal: '5@ms',
  },
  imageStyle: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1 / 0.9,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  paginationStyle: {
    bottom: '80@ms',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: '400@ms',
    marginBottom: '10@ms',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    borderColor: '$colors.textColor',
    borderWidth: 1,
    borderRadius: '25@ms',
    width: '40%',
    height: '50@ms',
  },
  buttonTitleStyle: {
    color: '$colors.textColor',
  },
});
