/**
 * User Profile Validator
 * @flow
 * @format
 */

export const userInfoSchema = {
  firstName: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterFirstName', // It's key of translation
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterLastName',
    },
  },
};

export const changePasswordSchema = {
  oldPassword: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterPassword',
    },
  },
  newPassword: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterNewPassword',
    },
  },
  confirmPassword: {
    presence: {
      allowEmpty: false,
      message: '^validation.confirmPasswordMismatch',
    },
    equality: {
      attribute: 'newPassword',
      message: '^validation.confirmPasswordMismatch',
    },
  },
};
