import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header, Content, Button, Text, ListItem } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
const UUID = require("uuid-v4");
const uuid = UUID();

class DevicesScreen extends Component {
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
          console.log("---------------ble PoweredOn------------------");
        }
    }, true);
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
    }, 1100);
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

  deviceDataEl = (data) => {
    console.log(data);
    return (
      <>
        <ListItem>
          <Text>Name: {data.name || "No Name"}</Text>
        </ListItem>
        <ListItem>
          <Text>- ID: {data.id}</Text>
        </ListItem>
        <ListItem>
          <Text>- RSSI: {data.rssi}</Text>
        </ListItem>
        <ListItem>
          <Text>- MTU: {data.mtu}</Text>
        </ListItem>
      </>
    );
  }

  render() {
    return (
        <>
          <Button onPress={this.startScan} style={styles.mainButton}>
            <Text>Start Scan</Text>
          </Button>
          <Button onPress={this.stopScan} style={styles.mainButton}>
            <Text>Stop Scan</Text>
          </Button>
          <Text>Bluetooth Devices Detected:</Text>
          <Content>

          <FlatList
            data={this.state.devices}
            renderItem={({item}) => this.deviceDataEl(item)}
          />
          </Content>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainButton: {
    fontSize: 20,
    marginTop: 10
  },
});

const mapStateToProps = state => {
  return {
   // devices: state.places.places
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onLoadDevices: () => dispatch(getDevices())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);
