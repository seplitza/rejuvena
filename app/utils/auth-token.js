/**
 * App Auth Token
 * @flow
 * @format
 */

// Set & get auth token
class AuthToken {
  static token: string | null;
  static set(token: string | null) {
    this.token = token;
  }
  static get() {
    return this.token;
  }
}

export {AuthToken};
