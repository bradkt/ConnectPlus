import BackgroundJob from 'react-native-background-job';
import DeviceInfo from 'react-native-device-info';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { updateDevices } from "../../store/actions";
import { AsyncStorage } from 'react-native';
import BLEservice from "./Bluetooth";
import _ from "lodash/array";

class BLEProcess {
    constructor() {
        this.ble = new BLEservice();
    }
  
    // state may eventually live in the reducer / firebase
    bleState = {
        locationBaseScan: [],
        currentScan: [],
        ignoredDevices: [],
        isNewLocation: false,
        myMacAddy:"",
        prevLocation: {latitude: 40.113348, longitude: -82.9966365}
    };

    startUp = async () => {
        let _this = this;

        bleJob = {
          jobKey: "BLE",
          job: () => _this.beginProcess()
        };

        BackgroundJob.register(bleJob);

        BackgroundJob.schedule({
          jobKey: "BLE",
          period: 900000,
          exact: true,
          allowWhileIdle: true,
          override: false,
          timeout: 2000,
          allowExecutionInForeground: true,
          networkType: BackgroundJob.NETWORK_TYPE_ANY,
          notificationText: "Running in background...",
          notificationTitle: "Background job"
        });
    }

    localStore = async () => {
        try {
            const ignored = await AsyncStorage.getItem('ignoredDevices');
            let parsed = JSON.parse(ignored);
            if (parsed !== null) {
              console.log("We have data: ", parsed);
              this.bleState.ignoredDevices = parsed
            } else {
              console.log("data was null");
            }
          } catch (error) {
            console.log("Error saving data", error);
          }
      }

    loadData = async () => {
      let _this = this;

      DeviceInfo.getMACAddress().then(mac => {
        _this.bleState.myMacAddy = mac
      });

      _this.localStore();

      location().then(coords => {
        this.LocationHandler(this.bleState.prevLocation, coords );
      })
      .catch( err => console.log(err));
      
      let scan = await this.ble.getCurrentBLEDevices();
  
      this.bleState.currentScan = scan;
      // this.bleState.currentScan = exampleLocationDevices;
    }


    beginProcess = async () => {
  
      await this.loadData();
      
      if(this.bleState.isNewLocation){
        this.bleState.locationBaseScan = [];
        console.log("new location reseting locationBaseScan");
      }
  
      // filter devices and updatedb
      let removeThese = [...this.bleState.locationBaseScan, ...this.bleState.ignoredDevices];
      let uniqueDevices = this.filterDevices(this.bleState.currentScan, removeThese);
  
      updateDevices(this.bleState.myMacAddy, uniqueDevices, this.bleState.prevLocation);
  
      if(!this.bleState.isNewLocation){
        this.bleState.locationBaseScan = [...this.bleState.locationBaseScan, ...uniqueDevices];
        console.log("not new location adding current to locationBaseScan");
      }
    }

    LocationHandler = (prev, curr) => {
        let isNew = isNewLocation(prev, curr);
        console.log("isNewLocation: ", isNew);
        if (isNew) {
            this.bleState.isNewLocation = true;
        } else {
            this.bleState.isNewLocation = false;
        }
        this.bleState.prevLocation = curr;
    }

    filterDevices = (currDevices, removeThese) => {
        let unique = _.differenceBy(currDevices, removeThese, 'id');
        return unique;
    }

    stopBGProcess = () => {
        console.log("stopping process");
        // BackgroundTimer.clearInterval(this.intervalId);
    }

}
  
export default BLEProcess;
