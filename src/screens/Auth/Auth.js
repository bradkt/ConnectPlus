import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn } from "../../store/actions/index";
import BLEdevices from "../../components/BlueTooth/Bluetooth";
import BackgroundTimer from 'react-native-background-timer';

class AuthScreen extends Component {
  state = {
    
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {

    
  }

  startBGProcess = () => {
    this.intervalId = BackgroundTimer.setInterval(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      console.log('----- tic ----- tock --------');
      // this.ble_service.startScan();
      
    }, (10 * 60) * 3);
  }

  stopBGProcess = () => {
    BackgroundTimer.clearInterval(this.intervalId);
  }

  render() {
    return (
      <>
        <BLEdevices />
        <Button onPress={this.startBGProcess}>
          <Text>Start Process</Text>
        </Button>
        <Text>Welcome</Text>
        <Button onPress={this.stopBGProcess}>
          <Text>Stop Process</Text>
        </Button>

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
