import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import AuthScreen from "../../screens/Auth/Auth";
import PlacesScreen from "../../screens/Places/Places";
import DevicesScreen from "../../screens/Devices/Devices";
import ProfileScreen from "../../screens/Profile/Profile";


const TabNavigator = createBottomTabNavigator({
    Home: AuthScreen,
    Devices: DevicesScreen,
    Places: PlacesScreen,
    Profile: ProfileScreen
  });
  
export default createAppContainer(TabNavigator);