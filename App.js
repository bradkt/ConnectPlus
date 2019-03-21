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