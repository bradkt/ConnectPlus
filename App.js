// symbol polyfills
global.Symbol = require('core-js/features/symbol');
require('core-js/features/symbol/iterator');

// collection fn polyfills
require('core-js/features/map');
require('core-js/features/set');
require('core-js/features/array/find');

import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from "react-redux"
import configureStore from './src/store/configureStore';
const store = configureStore();
import TabNavigator from "./src/components/Navigation/navigation"
import Layout from "./src/screens/Layout/Layout"

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <TabNavigator />
        </Layout>
      </Provider>
    );
  }
}