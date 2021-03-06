import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header, Content, Button, Text, ListItem } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { setDevices } from "../../store/actions/devices";
const UUID = require("uuid-v4");
const uuid = UUID();

class BLEdevices extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
  }

  state = {
    devicesLoaded: false,
    devices: []
  };


  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log("---------------ble compontent PoweredOn------------------");
        }
    }, true);

    // this.startScan();
    
  }

  startBGProcess = () => {
    this.startScan();
    // this.intervalId = BackgroundTimer.setInterval(() => {
    //   // this will be executed even when app is the the background
    //   console.log('----- scanning at interval --------');
    //   this.startScan();
      
    // }, (1000 * 3) * 5);
  }

  stopBGProcess = () => {
    // BackgroundTimer.clearInterval(this.intervalId);
  }

  startScan = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("there was an error scanning");
            console.log("error ->", error);
            console.log("device ->", device);
            return;
        }

        this.collectDeviceData(device);
        
    });

    setTimeout(() => {
      this.stopScan();
    }, 1500);
  }

  stopScan = () => {
    this.manager.stopDeviceScan();
    console.log("scanning stopped");
  }

  collectDeviceData = device => {
        // console.log("Device Name: ", device.name);
        // console.log("Device id: ", device.id);
        // console.log("Device rssi: ", device.rssi);
        // console.log("Device mtu: ", device.mtu);
        if ( !this.doesExsistInArray(this.state.devices, device.id )) {
          // console.log(device.id + ": did not exsist in array");
          let targetDeviceData = {
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            mtu: device.mtu,
            key: Math.random().toString()
          }
          this.setState(prevState => ({
            devices: [...prevState.devices, targetDeviceData]
          }))

        }
        else {
          console.log(device.id + ": ----------- exsist in array");
        }
        
  }

  doesExsistInArray = ( arry, target ) => {
    let inArray = false;
    for (i = 0; i < arry.length; i++) {
      if(arry[i].id === target){
        inArray = true;
        break;
      }
    } 
    return inArray;
  }

  deviceDataEl = (data) => {
    return (
      <>
        <ListItem>
          <Text>Name: {data.name || "No Name"} | ID: {data.id} | RSSI: {data.rssi} </Text>
        </ListItem>
      </>
    );
  }

  render() {
    return (
      <Content>
        <Text>Number of devices detected: {this.state.devices.length} </Text>
          <Button onPress={this.startBGProcess} style={styles.mainButton}>
            <Text>Start Scan</Text>
          </Button>
          <Button onPress={this.stopBGProcess} style={styles.mainButton}>
            <Text>Stop Scan</Text>
          </Button>
          <FlatList
            data={this.state.devices}
            renderItem={({item}) => this.deviceDataEl(item)}
          />
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  mainButton: {
    fontSize: 20,
    marginTop: 10
  },
});

const mapStateToProps = state => {
  return {
    devices: state.places.places
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadDevices: () => dispatch(getDevices()),
    setDevices: () => dispatch(setDevices(this.state.devices))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BLEdevices);