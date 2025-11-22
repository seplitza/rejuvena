/**
 * Auth Validator
 * @flow
 * @format
 */

export const loginFormSchema = {
  email: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterEmail', // Translation key
    },
    email: {
      message: '^validation.invalidEmail',
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterPassword',
    },
  },
};

export const signupSchema = {
  email: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterEmail',
    },
    email: {
      message: '^validation.invalidEmail',
    },
  },
};

export const forgotPasswordSchema = {
  email: {
    presence: {
      allowEmpty: false,
      message: '^validation.enterEmail',
    },
    email: {
      message: '^validation.invalidEmail',
    },
  },
};
