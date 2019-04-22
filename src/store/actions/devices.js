import { SET_DEVICES, REMOVE_DEVICE, ADD_SCAN, BLOCK_DEVICE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import fb from "../../services/firebase"
import { result } from "../../assets/FBDLallDevices";
// import location from "../reducers/location";

let getTime = () => {
  return Date.now();
}

// namedLocations
// labels

export const updateDevices = (uuid, scan, location) => {
  console.log("uuid: ", uuid, "scan: ", scan, "location: ", location);
  scan.map(device => {
    addDeviceToDB(uuid, device, location, getTime());
  })
};

addDeviceToDB = (uuid, device, location, time) => {
  let updatedDevice = {
    rssi: device.rssi,
    mtu: device.mtu,
    location: location,
    isAssignedName: device.isAssignedName,
    isBlocked: device.isBlocked,
    name: device.name
  };

  fb.database().ref('users/' + uuid + "/" + device.id + "/" + time).update(
    updatedDevice
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("data xfer success")
    }
  });
}


  export const getDevices = (uuid) => {
    console.log("getting devices");
    return dispatch => {
      dispatch(uiStartLoading());
        
      // fb.database().ref('users/' + uuid + "/").on('value', function(snapshot) {
      //   dispatch(setDevice(snapshot.val()));

      // });

      dispatch(setDevice(result));
       
      dispatch(uiStopLoading());
    };
  };

  export const setDevice = (data) => {
    return {
      type: SET_DEVICES,
      data: data
    };
  };


  export const getDevice = (uuid, mac) => {
    console.log("getting devices");
    return dispatch => {
      dispatch(uiStartLoading());
        
      fb.database().ref('users/' + uuid + "/").on('value', function(snapshot) {
        SET_DEVICES(snapshot.val());

      });
       
      dispatch(uiStopLoading());
    };
  };

  export const updateDevice = (uuid, mac) => {
    console.log("getting devices");
    return dispatch => {
      dispatch(uiStartLoading());
        
      fb.database().ref('users/' + uuid + "/").on('value', function(snapshot) {
        console.log(snapshot.val());

      });
       
      dispatch(uiStopLoading());
    };
  };
