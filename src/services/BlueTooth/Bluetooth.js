import { BleManager } from 'react-native-ble-plx';
import BackgroundTimer from 'react-native-background-timer';
const UUID = require("uuid-v4");
const uuid = UUID();

class BLEservice {
  constructor() {
    this.manager = new BleManager();
  }

  // state will eventually live in the reducer / firebase
  bleState = {
    devices: [],
    isScanning: false
  };

  getCurrentBLEDevices = () => {
    console.log("getting devices")
    return this.bleState;
  }

  startBGProcess = () => {
    this.intervalId = BackgroundTimer.setInterval(() => {
      // this will be executed even when app is the the background
      console.log('----- scanning at interval --------');
      this.startScan();
      
    }, (1000 * 3) * 5);
  }

  stopBGProcess = () => {
    console.log("stopping process")
    BackgroundTimer.clearInterval(this.intervalId);
  }

  startScan = () => {
    this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log("---------------ble PoweredOn------------------");
      }
    }, true);
    this.manager.startDeviceScan(null, null, (error, device) => {
        this.bleState.isScanning = true;
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("there was an error scanning ->", error);
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
    this.bleState.isScanning = false;
    console.log("scanning stopped");
  }

  collectDeviceData = device => {
        // console.log("Device Name: ", device.name);
        // console.log("Device id: ", device.id);
        // console.log("Device rssi: ", device.rssi);
        // console.log("Device mtu: ", device.mtu);
        if ( !this.doesExsistInArray(this.bleState.devices, device.id )) {
          // console.log(device.id + ": did not exsist in array");
          let targetDeviceData = {
            name: device.name,
            id: device.id,
            rssi: device.rssi,
            mtu: device.mtu,
          }
          this.bleState.devices.push(targetDeviceData)

        }
        else {
          console.log(device.id + ": ----------- exsist in current scan array");
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
 
}

export default BLEservice;