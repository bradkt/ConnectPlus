import { BleManager } from 'react-native-ble-plx';
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

// https://stackoverflow.com/questions/47513549/timers-in-react-native-this-settimeout
  getCurrentBLEDevices = () => {
    let _this = this;
    this.startScan();
    setTimeout(() => {
      _this.stopScan();
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
    console.log("scanning start");
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
        if ( !doesExsistInArray(this.bleState.devices, device.id )) {
          console.log(device.id + "--- NOT IN current scan");
          // will want to move  the adding of extra props out of this file
          
          let targetDeviceData = {
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            mtu: device.mtu,
          }
          this.bleState.devices.push(targetDeviceData);
        }
        else {
          // console.log(device.id + "--- exsist in current scan");
        }
  }
}

export default BLEservice;