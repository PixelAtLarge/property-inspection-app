/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Suppress all warning banners
LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
