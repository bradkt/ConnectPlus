import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet, FlatList, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, updateDevices } from "../../store/actions";
import BLEservice from "../../services/BlueTooth/Bluetooth";
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { doesExsistInArray } from "../../utility";
import { exampleLocationDevices } from "../../assets/deviceObjExample";
import _ from "lodash/array";

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEservice();
    this.loadData = this.loadData.bind(this);
    this.beginProcess = this.beginProcess.bind(this);
  }

  state = {
    locationBaseScan: [],
    currentScan: [],
    ignoredDevices: [],
    isNewLocation: false,
    myMacAddy:"",
    prevLocation: {latitude: 40.113348, longitude: -82.9966365}
  };

  componentDidMount = () => {
    let _this = this;
    
    DeviceInfo.getMACAddress().then(mac => {
      _this.setState({ myMacAddy: mac })
    });
  }

  async loadData() {

    location().then(coords => {
      this.LocationHandler(this.state.prevLocation, coords );
    })
    .catch( err => console.log(err));
    
    let scan = await this.ble.getCurrentBLEDevices();

    this.setState({ currentScan: scan });

    // filter devices and updatedb
  }

  async beginProcess() {
    
    await this.loadData();
    console.log("I awaited load data ;)");
    
    if(this.state.isNewLocation){
      this.setState({ locationBaseScan: [] });
      console.log("new location reseting locationBaseScan");
    }

    // filter devices and updatedb
    let removeThese = [...this.state.locationBaseScan, ...this.state.ignoredDevices];
    let uniqueDevices = this.filterDevices(this.state.currentScan, removeThese);

    updateDevices(this.state.myMacAddy, uniqueDevices, this.state.prevLocation);

    if(!this.state.isNewLocation){
      this.setState({ locationBaseScan: [...this.state.locationBaseScan, ...uniqueDevices] });
      console.log("not new location adding current to locationBaseScan");
    }
  }

  LocationHandler = (prev, curr) => {
    let isNew = isNewLocation(prev, curr);
    console.log("isNewLocation: ", isNew);
    if (isNew) {
      this.setState({ isNewLocation: true });
    } else {
      this.setState({ isNewLocation: false });
    }
    this.setState({ prevLocation: curr });
  }

  filterDevices = (currDevices, removeThese) => {
    // console.log(currDevices)
    let unique = _.differenceBy(currDevices, removeThese, 'id');
    return unique;
  }

  render() {
    return (
      <>
        <Text>Welcome</Text>
        <Button onPress={this.beginProcess}>
            <Text>Run Process</Text>
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
    devices: state.devices.devices,
    location: state.location.location,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDevices: (uuid, scan, location) => dispatch(updateDevices(uuid, scan, location)),
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
