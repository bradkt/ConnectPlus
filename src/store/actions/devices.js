import { SET_DEVICES, REMOVE_DEVICE, ADD_SCAN, BLOCK_DEVICE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import fb from "../../services/firebase"
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
    location: location
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


export const getDevices = () => {
    // console.log("getting devices");
    // return dispatch => {
    //   dispatch(authGetToken())
    //     .then(token => {
    //       return fetch(
    //         "https://fb-rnplay.firebaseio.com/places.json?auth=" +
    //           token
    //       );
    //     })
    //     .catch(() => {
    //       alert("No valid token found!");
    //     })
    //     .then(res => {
    //       if (res.ok) {
    //         return res.json();
    //       } else {
    //         throw new Error();
    //       }
    //     })
    //     .catch(err => {
    //       alert("Something went wrong, could not get place :/");
    //       console.log(err);
    //     });
    // };
  };
