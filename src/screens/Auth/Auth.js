import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet, FlatList, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn } from "../../store/actions/index";
import BLEdevices from "../../components/BlueTooth/Bluetooth";
import BLEservice from "../../services/BlueTooth/Bluetooth";
import BackgroundTimer from 'react-native-background-timer';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEservice();
  }

  state = {
    
  };

  componentDidMount = () => {
    
    this.ble.startScan();
    setTimeout(() => {
      this.bledata();
    }, 3500);
    
  }

  bledata = () => {
    console.log("bledata()")
    console.log(this.ble.getCurrentBLEDevices());
  }

  render() {
    return (
      <>
        <Text>Welcome</Text>
        {/* <BLEdevices /> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    devices: state.devices.devices
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
