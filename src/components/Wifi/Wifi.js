import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet } from 'react-native';
import { connect } from "react-redux";
import WifiManager from 'react-native-wifi';


class Wifi extends Component {
    state = {

    };
  
    constructor(props) {
      super(props);
    }
  
    getWifiData = () => {

      WifiManager.getCurrentWifiSSID()
      .then((ssid) => {
        console.log("Your current connected wifi SSID is " + ssid)
      }, () => {
        console.log('Cannot get current SSID!')
      })
  
      WifiManager.loadWifiList(this.wifiListSuccess, this.wifiListError)
    }
  
    wifiListSuccess = (data) => {
      console.log("wifiListSuccess")
      console.log("data: ", data)
    }
    
    wifiListError = (data) => {
      console.log("wifiListError")
      console.log("data: ", data)
    }
  
    componentDidMount() {
  
    }
  
  
    render() {
    
      return (
        <>
          <Button onPress={this.getWifiData}>
            <Text>Get Wifi data</Text>
          </Button>
          <Text>Model: {this.state.deviceInfo.model}</Text>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
  });
  
  const mapStateToProps = state => {
    return {
      isLoading: state.ui.isLoading
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Wifi);