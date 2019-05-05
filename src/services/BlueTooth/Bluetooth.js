import { BleManager } from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';
// import BackgroundTimer from 'react-native-background-timer';
import { doesExsistInArray } from "../../utility";

class BLEservice {
  constructor() {
    this.manager = new BleManager();
    this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log("-----ble PoweredOn---");
      }
    }, true);
  }

  // state may eventually live in the reducer / firebase
  bleState = {
    devices: [],
    isScanning: false,
    hadError: false
  };


  getCurrentBLEDevices = () => {
    let _this = this;
    this.startScan();
    setTimeout(() => {
      this.stopScan();
    }, 1500);
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve(_this.bleState.devices);
      }, 2500);
    });
  };

  reset = () => {
    this.bleState.hadError = false;
  }



  startScan = () => {
    this.bleState.isScanning = true;

    this.manager.startDeviceScan(null, null, (error, device) => {

        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("there was an error scanning ->", error);
            this.bleState.hadError = true;
            this.stopScan();
            return error;
        }
        this.collectDeviceData(device);
    });
    
  }

  stopScan = () => {
    this.manager.stopDeviceScan();
    this.bleState.isScanning = false;
    console.log("scanning stopped");
  }

  collectDeviceData = device => {
        // console.log("Device Name: ", device.name);
        // console.log("Device id: ", device.id);
        // console.log("Device rssi: ", device.rssi);
        // console.log("Device mtu: ", device.mtu);
        if ( !doesExsistInArray(this.bleState.devices, device.id )) {
          // console.log(device.id + ": did not exsist in array");
          console.log(device.id + "--- NOT IN current scan array");
          // will want to move  the adding of extra props out of this file
          let date = new Date();
          let targetDeviceData = {
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            mtu: device.mtu,
            ISOtime: date.toISOString(),
            timezone: DeviceInfo.getTimezone()
          }
          this.bleState.devices.push(targetDeviceData);
        }
        else {
          // console.log(device.id + "--- exsist in current scan array");
        }
  }
}

export default BLEservice;