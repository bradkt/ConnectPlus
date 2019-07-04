import { SET_DEVICES, SET_USER_SETTINGS, SET_USER_PROFILE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import fb from "../../services/firebase";
import DeviceInfo from 'react-native-device-info';
import { result } from "../../assets/FBDLallDevices";
import { dispatch } from 'rxjs/internal/observable/pairs';
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

createBaseLocation = (location) => {
  let lat = location.latitude.toString().replace(".", "");
  let long = location.longitude.toString().replace(".", "");

  lat = lat.includes("-") ? lat.substring(0, 6) : lat.substring(0, 5);
  long = long.includes("-") ? long.substring(0, 6) : long.substring(0, 5);

  return lat + "_" + long;
}

// 04/28 going to only add scans as come in
// update object to users/uuid/(profile/devices/settings(ignoredDevices))

addDeviceToDB = (uuid, device, location, time) => {
  let date = new Date();
  let baseLocation = this.createBaseLocation(location);
  console.log(baseLocation);

  let scan = {
    rssi: device.rssi,
    mtu: device.mtu,
    location: location,
    name: device.name,
    ISOtime: date.toISOString(),
    tz: DeviceInfo.getTimezone()
  };
  
  fb.database().ref('users/' + uuid + "/devices/" + device.id + "/locations/" + baseLocation + "/scans/" + time ).update(
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

getData = (endpoint) => {
  console.log("getting data::::", endpoint)
    fb.database().ref('/users/' + endpoint).once('value').then(function(snapshot) {
      let data = snapshot.val();
      console.log(data)
    }).catch(error => console.log(error));
}

export const ignoreDevice = (uuid, deviceId) => {
  let data = {
    isIgnored: true,
  };
  fb.database().ref('users/' + uuid + "/devices/" + deviceId).update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error)
    } else {
      console.log("ignore Device xfer success")
    }
  });
};

export const getUserSettings = (uuid) => {
  return dispatch => {
    fb.database().ref('/users/' + uuid + "/settings/").once('value').then(function(snapshot) {
      let data = snapshot.val();
      console.log(data)
      dispatch({ type: SET_USER_SETTINGS, data: data });
    }).catch(error => console.log(error));
  };
}

export const getUserProfile = (uuid) => {
  return dispatch => {
    fb.database().ref('/users/' + uuid + "/profile/").once('value').then(function(snapshot) {
      let data = snapshot.val();
      console.log(data)
      dispatch({ type: SET_USER_PROFILE, data: data });
    }).catch(error => console.log(error));
  };
}






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