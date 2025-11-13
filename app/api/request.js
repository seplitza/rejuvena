/**
 * Axios API
 * Middleware of api request and response
 * @flow
 * @format
 */

import axios from 'axios';
import * as Config from '@app/config';
import {AuthToken} from '@app/utils';

/**
 * Creating custom instance for config
 * server configurations.
 * baseUrl, timeout, api-token etc.
 */
const request = axios.create({
  baseURL: `${Config.API_URL}/api`,
});

/**
 * axios request interceptors for debugging
 * and modify request data
 */
request.interceptors.request.use(
  (reqConfig) => {
    const token = AuthToken.get();
    if (token) {
      reqConfig.headers = {Authorization: `Bearer ${token}`};
    }
    reqConfig.headers.UserLanguage = 'en';
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Customizing axios success and error
 * data to easily handle them in app
 */
request.interceptors.response.use(
  (response) => {
    console.log(`API ${response.config.url}`, response.data);
    return response.data;
  },
  (error) => Promise.reject(handleApiError(error)),
);

// Handling error
const handleApiError = (error) => {
  try {
    if (error.response) {
      /* Server stopped error */
      if (error.response.status === 403) {
        return {message: 'Server is down. Please try again later.'};
      }
      /*
        Able to connect with server, but something
        went wrong and api returned reason for that
      */
      return {
        message: error.response.data,
        // code: error.response.data.code,
      };
    } else {
      // Not able to connect with server
      return {message: error.message};
    }
  } catch {
    // Can't figure out source of error
    return {message: 'unknown error occurred'};
  }
};

export {request};
