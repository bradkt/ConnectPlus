import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet, FlatList, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, addScan } from "../../store/actions";
// import BLEdevices from "../../components/BlueTooth/Bluetooth";
import BLEservice from "../../services/BlueTooth/Bluetooth";
import setLocationHandler from "../../services/Location/Coordinates";
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import LocationService from "../../services/Location/Coordinates"


class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEservice();
  }

  authState = {
    locationBaseScan: [],
    currentScan: []
  };

  componentDidMount = () => {
    setLocationHandler();
    this.ble.startScan();
    setTimeout(() => {
      this.bledata();
    }, 3500);
    
  }

  bledata = () => {
    let scan = this.ble.getCurrentBLEDevices();
    console.log("data scan: ", scan);
    this.authState.currentScan = scan;
  }

  start = () => {
    let macAddy = "2323";
    DeviceInfo.getMACAddress().then(mac => {
      macAddy = mac;
    });
    let scan = this.ble.getCurrentBLEDevices();
    
    setTimeout(() => {
      this.props.addScan(macAddy, scan);
    }, 3500);
    
  }

  render() {
    return (
      <>
        <Text>Welcome</Text>
        <Button onPress={this.start}>
            <Text>Send FB</Text>
        </Button>
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
    addScan: (uuid, scan) => dispatch(addScan(uuid, scan)),
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
