import BackgroundJob from 'react-native-background-job';
import DeviceInfo from 'react-native-device-info';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { updateDevices } from "../../store/actions";
import { AsyncStorage } from 'react-native';
import BLEservice from "./Bluetooth";
import { getSpeed } from '../Location/Coordinates'
import _ from "lodash/array";

class BLEProcess {
    constructor() {
        this.ble = new BLEservice();
    }
  
    // state may eventually live in the reducer / firebase
    state = {
        locationBaseScan: [],
        currentScan: [],
        ignoredDevices: [],
        isNewLocation: false,
        myMacAddy:"",
        prevLocation: {}
    };

    startUp = async () => {
        let _this = this;

        location().then(coords => {
          this.state.prevLocation = coords;
        })
        .catch( err => console.log(err));

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

    getLocalStore = async () => {
        try {
            const storedIgnored = await AsyncStorage.getItem('ignoredDevices');
            let ignoredDevices = JSON.parse(storedIgnored);
            if (ignoredDevices !== null) {
              console.log("We have data: ", ignoredDevices);
              this.state.ignoredDevices = ignoredDevices
            } else {
              console.log("data was null");
            }
          } catch (error) {
            console.log("Error saving data", error);
          }
    }

    loadData = async () => {

      location().then(coords => {
        this.LocationHandler(this.state.prevLocation, coords );
      })
      .catch( err => console.log(err));

      DeviceInfo.getMACAddress().then(mac => {
        this.state.myMacAddy = mac
      });

      this.getLocalStore();
      
      let scan = await this.ble.getCurrentBLEDevices();
  
      this.state.currentScan = scan;
      // this.state.currentScan = exampleLocationDevices;
    }


    beginProcess = async (force = false) => {

      let speed = await this.checkSpeed();
      let uniqueDevices = [];
      let removeThese = [];
      
      if ( speed < 6 || force ) {
        console.log("running process");
        await this.loadData();
        
        if(this.state.isNewLocation){
          this.state.locationBaseScan = [];
          console.log("new location reseting locationBaseScan");
        }
    
        // filter devices and updatedb
        removeThese = [...this.state.locationBaseScan, ...this.state.ignoredDevices];
        // console.log("bleprocess remove these: ", removeThese);
        uniqueDevices = this.filterDevices(this.state.currentScan, removeThese);
        // console.log("bleprocess uniqueDevices: ", uniqueDevices);
        updateDevices(this.state.myMacAddy, uniqueDevices, this.state.prevLocation);
    
        if(!this.state.isNewLocation){
          this.state.locationBaseScan = [...this.state.locationBaseScan, ...uniqueDevices];
          console.log("not new location adding current to locationBaseScan");
        }
     } else {
      console.log("speed not less than 6 or not forced");
     }

    return uniqueDevices;
  }

  LocationHandler = (prev, curr) => {
      let isNew = isNewLocation(prev, curr);
      console.log("isNewLocation: ", isNew);
      if (isNew) {
          this.state.isNewLocation = true;
      } else {
          this.state.isNewLocation = false;
      }
      this.state.prevLocation = curr;
  }

  filterDevices = (currDevices, removeThese) => {
      let unique = _.differenceBy(currDevices, removeThese, 'id');
      return unique;
  }

  checkSpeed = () => {
    getSpeed().then(spd => {
      console.log("profile spd: ", spd);
      return spd;
    });
  }

  stopBGProcess = () => {
      console.log("stopping process");
  }
  
}
  
export default BLEProcess;
