import { updateDevices } from "../../store/actions";
// import BackgroundTimer from 'react-native-background-timer';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { AsyncStorage } from 'react-native';
import BLEservice from "./Bluetooth";
import { exampleLocationDevices } from "../../assets/deviceObjExample";
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
        prevLocation: {latitude: 40.113348, longitude: -82.9966365}
    };

    componentDidMount = async () => {
        let _this = this;
        console.log("---------componentDidMount----------");
    
        DeviceInfo.getMACAddress().then(mac => {
          _this.setState({ myMacAddy: mac })
        });

        _this.localStore();
    }


    localStore = async () => {
        try {
            console.log("trying");
            const ignored = await AsyncStorage.getItem('ignoredDevices');
            let parsed = JSON.parse(ignored);
            if (parsed !== null) {
              console.log("We have data!!");
              this.setState({
                ignoredDevices: parsed
              })
              
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
        
        let scan = await this.ble.getCurrentBLEDevices();
    
        this.setState({ currentScan: scan });
        // this.setState({ currentScan: exampleLocationDevices });
      }


      beginProcess = async () => {
    
        await this.loadData();
        console.log("I awaited load data ;)");
        
        if(this.state.isNewLocation){
          this.setState({ locationBaseScan: [] });
          console.log("new location reseting locationBaseScan");
        }
    
        // filter devices and updatedb
        let removeThese = [...this.state.locationBaseScan, ...this.state.ignoredDevices];
        let uniqueDevices = this.filterDevices(this.state.currentScan, removeThese);
    
        // updateDevices(this.state.myMacAddy, uniqueDevices, this.state.prevLocation);
    
        if(!this.state.isNewLocation){
          this.setState({ locationBaseScan: [...this.state.locationBaseScan, ...uniqueDevices] });
          console.log("not new location adding current to locationBaseScan");
        }
      }
  
    // this is the best function name ever
    repeter = () => {
        // this.intervalId = BackgroundTimer.setInterval(() => {

        //     // this will be executed even when app is the the background
        //     console.log('----- repeating ble process --------');
           
            
        
        // }, (1000 * 3) * 2);
    }

    LocationHandler = (prev, curr) => {
        let isNew = isNewLocation(prev, curr);
        console.log("isNewLocation: ", isNew);
        if (isNew) {
            this.setState({ isNewLocation: true });
        } else {
            this.setState({ isNewLocation: false });
        }
        this.setState({ prevLocation: curr });
    }

    filterDevices = (currDevices, removeThese) => {
        // console.log(currDevices)
        let unique = _.differenceBy(currDevices, removeThese, 'id');
        return unique;
    }

    stopBGProcess = () => {
        console.log("stopping process");
        // BackgroundTimer.clearInterval(this.intervalId);
    }

}
  
export default BLEProcess;
