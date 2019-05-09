import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import AuthScreen from "../../screens/Auth/Auth";
import PlacesScreen from "../../screens/Places/Places";
import DevicesScreen from "../../screens/Devices/Devices";
import ProfileScreen from "../../screens/Profile/Profile";
import HomeScreen from "../../screens/Auth/Home";


const TabNavigator = createBottomTabNavigator({
    Home: AuthScreen,
    Play: ProfileScreen,
    Places: PlacesScreen,
    Profile: HomeScreen
  });
  
export default createAppContainer(TabNavigator);