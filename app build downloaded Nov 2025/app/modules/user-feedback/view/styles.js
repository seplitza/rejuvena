/**
 * User Feedback Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    padding: '10@ms',
    backgroundColor: '#fff',
  },
  titleStyle: {
    color: '$colors.primary',
    fontSize: '22@ms',
  },
  feedbackMessageStyle: {
    color: '$colors.primary',
    fontSize: '18@ms',
    paddingVertical: '10@ms',
  },
  buttonStyle: {
    alignSelf: 'center',
    marginVertical: '20@ms',
    borderRadius: '10@ms',
  },
  buttonTitleStyle: {
    color: '#fff',
    fontSize: '22@ms',
  },
  ratingContainerStyle: {
    width: '50%',
    maxWidth: '200@ms',
    paddingVertical: '20@ms',
  },
  horizontalLine: {
    borderWidth: 1,
    borderColor: '$colors.darkTextColor',
  },
  inputStyle: {
    height: '100%',
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  inputContainer: {
    height: '200@ms',
    width: '100%',
    padding: '5@ms',
    borderColor: '$colors.darkTextColor',
    borderWidth: 0.5,
    alignSelf: 'center',
  },
});
