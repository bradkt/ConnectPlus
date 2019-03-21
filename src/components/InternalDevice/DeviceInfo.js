import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet } from 'react-native';
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';


class DeviceInfo extends Component {
  state = {
    deviceInfo: {
      model: "",
      manufacturer: "",
      uniqueId: "",
      timezone: "",
      mac: "",
      isCharging: false
    }
  };

  constructor(props) {
    super(props);
  }

  getDeviceData = () => {
    const uniqueId = DeviceInfo.getUniqueID();
    const manufacturer = DeviceInfo.getManufacturer();
    const model = DeviceInfo.getModel();
    const timezone = DeviceInfo.getTimezone();

    console.log("model: " ,model);
    console.log("manufacturer: " ,manufacturer);
    console.log("uniqueId: " ,uniqueId);
    console.log("timezone: " ,timezone);

    this.setState(prevState => ({
      deviceInfo: {
          ...prevState.deviceInfo,
          model: model,
          manufacturer: manufacturer,
          uniqueId: uniqueId,
          timezone: timezone
      }
  }))
    
    DeviceInfo.getMACAddress().then(mac => {
      // "E5:12:D8:E5:69:97"
      console.log(mac);
      this.setState(prevState => ({
        deviceInfo: {
            ...prevState.deviceInfo,
            mac: mac
        }
    }))
    });
    DeviceInfo.isBatteryCharging().then(isCharging => {
      console.log(`is charging: ${isCharging}`)
      this.setState(prevState => ({
        deviceInfo: {
            ...prevState.deviceInfo,
            isCharging: isCharging
        }
    }))
    });
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        <Button onPress={this.getDeviceData}>
          <Text>Get device data</Text>
        </Button>
        <Text>Model: {this.state.deviceInfo.model}</Text>
        <Text>Manufacturer: {this.state.deviceInfo.manufacturer}</Text>
        <Text>UniqueID: {this.state.deviceInfo.uniqueId}</Text>
        <Text>TimeZone: {this.state.deviceInfo.timezone}</Text>
        <Text>Mac: {this.state.deviceInfo.mac}</Text>
        <Text>Charging: {this.state.deviceInfo.isCharging ? "Charging" : "Not Charging" }</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfo);
