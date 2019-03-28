import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";


class AccelerometerSensor {
  state = {
    acceleration: 0,
    speed: 0,
    accel_x: 0,
    accel_y: 0,
    accel_z: 0,
    timestamp: "",
  };

  round(n) {
    if (!n) {
      return 0;
    }
  
    return Math.floor(n * 100) / 100;
  }

 getSpeed = () => {

  // using this is causing error
  // setUpdateIntervalForType(SensorTypes.Accelerometer, 400); // defaults to 100ms

  accelerometer.subscribe(({ x, y, z, timestamp }) => {

    console.log("X: ", this.round(x), "Y: ", this.round(y), "Z: ", this.round(z));
    
      this.state.accel_x = x;
      this.state.accel_y = y;
      this.state.accel_z = z;
      this.state.timestamp = timestamp;
      // speed: speed
    
    }
  );

  // const gyro_subscription = gyroscope.subscribe(({ x, y, z, timestamp }) =>
  //   console.log({ x, y, z, timestamp })
  // );

  
  setTimeout(() => {
    // If it's the last subscription to accelerometer it will stop polling in the native API
    this.subscription.unsubscribe();
  }, 2000);

 }


}

export default AccelerometerSensor;