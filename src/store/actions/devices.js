import { SET_DEVICES, REMOVE_DEVICE, ADD_SCAN, BLOCK_DEVICE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import fb from "../../services/firebase";
import DeviceInfo from 'react-native-device-info';
import { result } from "../../assets/FBDLallDevices";
// import location from "../reducers/location";

let getTimeStamp = () => {
  return Date.now();
}



// namedLocations
// labels

// There are 3 main objects on each user: devices, settings, profile

export const updateDevices = (uuid, scan, location) => {
  // console.log("uuid: ", uuid, "scan: ", scan, "location: ", location);
  scan.map(device => {
    addDeviceToDB(uuid, device, location, getTimeStamp());
  })
};

// 04/28 going to only add scans as come in
// update object to users/uuid/(profile/devices/settings(ignoredDevices))

addDeviceToDB = (uuid, device, location, time) => {
  
  let scan = {
    rssi: device.rssi,
    mtu: device.mtu,
    location: location,
    name: device.name,
    ISOtime: device.ISOtime,
    tz: device.timezone
  };
  
  fb.database().ref('users/' + uuid + "/devices/" + device.id + "/scans/" + time ).update(
    scan
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("addDeviceToDB xfer success")
    }
  });
}

export const getDevices = (uuid) => {
  return dispatch => {
    dispatch({type: "UI_START_LOADING"});
    
    fb.database().ref('/users/' + uuid + "/devices/").once('value').then(function(snapshot) {
      let devices = snapshot.val();
      // console.log("action devices::: ", devices);
      dispatch({ type: "SET_DEVICES", data: devices });
      dispatch({type: "UI_STOP_LOADING"});
    }).catch(error => console.log(error));
  };
};

export const setDeviceName = (uuid, deviceId, name) => {
  let data = {
    isAssignedName: true,
    assignedName: name
  };

  fb.database().ref('users/' + uuid + "/devices/" + deviceId).update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("setDeviceName xfer success")
    }
  });
};

setIgnoredDevices = (uuid, ignoredDevices) => {
  let data = {
    ignoredDevices,
  };
  fb.database().ref('users/' + uuid + "/settings/").update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("setIgnoredDevices xfer success")
    }
  });
}

export const blockDevice = (uuid, deviceId) => {
  let data = {
    isBlocked: true,
  };

  fb.database().ref('users/' + uuid + "/devices/" + deviceId).update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("blockDevice xfer success")
    }
  });
};




//---------------------------------------
export const getDevice = (uuid, mac) => {
  console.log("getting devices");
  return dispatch => {
    dispatch(uiStartLoading());
      
    fb.database().ref('users/' + uuid + "/devices/" + mac).on('value', function(snapshot) {
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

fbData = (uuid, deviceId, data) => {
  fb.database().ref('users/' + uuid + "/" + deviceId + "/").update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("fbData xfer success")
    }
  });
}