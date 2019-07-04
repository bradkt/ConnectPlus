import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle } from 'native-base';
import { StyleSheet } from 'react-native';
import { connect } from "react-redux";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";


class AccelerometerSensor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      acceleration: 0,
      speed: 0,
      accel_x: 0,
      accel_y: 0,
      accel_z: 0,
      timestamp: "",
      placesLoaded: false};
  }

  round(n) {
    if (!n) {
      return 0;
    }
  
    return Math.floor(n * 100) / 100;
  }

 getSpeed = () => {

  // setUpdateIntervalForType(SensorTypes.Accelerometer, 400); // defaults to 100ms

  // const accel_subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
  //   console.log({ x, y, z, timestamp })
  // );


  // const gyro_subscription = gyroscope.subscribe(({ x, y, z, timestamp }) =>
  //   console.log({ x, y, z, timestamp })
  // );

  this.subscription = accelerometer
  .pipe(map(({ x, y, z, timestamp, speed }) => {
    console.log("-------------------------------------")
    console.log("X: ", this.round(x), "Y: ", this.round(y), "Z: ", this.round(z));
    this.setState({
      accel_x: x,
      accel_y: y,
      accel_z: z,
      timestamp: timestamp,
      speed: speed
    })
    x + y + z
  }), filter(speed => {
    console.log("speed............ ", speed);
  }))
  .subscribe(
    speed => {
      console.log(`You moved your phone with: ${speed}`);
      this.setState({
        speed: speed,
      })
    },
    error => {
      console.log("The sensor is not available: " + error);
      this.setState({
        text: error,
      })
    }
  );

  
  setTimeout(() => {
    // If it's the last subscription to accelerometer it will stop polling in the native API
    this.subscription.unsubscribe();
  }, 2000);

 }



  render() {
    return (
      <>
        <Button onPress={this.getSpeed}>
            <Text>Get Accelerometer Data</Text>
        </Button>
        <Text >
          X: {this.round(this.state.accel_x)}
        </Text>
        <Text >
          Y: {this.round(this.state.accel_y)}
        </Text>
        <Text >
          Z: {this.round(this.state.accel_z)}
        </Text>
        <Text >
          Time: {this.state.timestamp}
        </Text>
        <Text >
          Speed: {this.state.speed}
        </Text>
        <Text >
          Text: {this.state.text}
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  searchButtonText: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 26
  }
});

const mapStateToProps = state => {
  return {
    // location: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // getLocation: () => dispatch(getLocation())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccelerometerSensor);