/**
 * App Registry
 * @flow
 * @format
 */

import {AppRegistry} from 'react-native';
import Main from './app/main';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Main);
