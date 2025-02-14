/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';

function Main() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
