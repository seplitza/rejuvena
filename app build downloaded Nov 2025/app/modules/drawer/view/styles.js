/**
 * Drawer Styles
 * @flow
 * @format
 */

import {EStyleSheet} from '@app/styles';

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  userImageStyle: {
    alignSelf: 'center',
    height: '110@ms',
    width: '110@ms',
    borderRadius: '55@ms',
    overflow: 'hidden',
    marginTop: '10@ms',
  },
  itemStyle: {
    flexDirection: 'row',
    height: '40@ms',
    width: '100%',
    paddingHorizontal: '15@ms',
    alignItems: 'center',
    marginTop: '1@ms',
  },
  labelStyle: {
    color: '#fff',
    fontSize: '24@ms',
    fontFamily: '$fonts.DINLight',
  },
  termsLabelStyle: {
    fontSize: '16@ms',
    paddingHorizontal: '15@ms',
    lineHeight: '30@ms',
    fontFamily: '$fonts.DINLight',
  },
  termsContainer: {
    marginTop: 'auto',
    marginBottom: '10@ms',
  },
  languagePickerStyle: {
    marginLeft: 'auto',
    padding: '10@ms',
  },
  notificationIconStyle: {
    marginLeft: '7@ms',
  },
  iconStyle: {
    fontSize: '25@ms',
    color: '$colors.textColor',
    marginRight: '5@ms',
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});
