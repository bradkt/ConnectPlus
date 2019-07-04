import fb from "../../services/firebase";
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
// import { SET_KNOWN_LOCATION } from './actionTypes';



export const setLocation = (location) => {
  console.log("setting place: ", location);

  return dispatch => {
    // dispatch(SET_KNOWN_LOCATION);
    // AsyncStorage.setItem("ap:auth:token", token);
    // AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
    // AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
  };
};


export const setKnownLocation = (uuid, location) => {
  console.log("location: ", location)
  let data = {
    coords: location.coords
  };
  fb.database().ref('users/' + uuid + "/settings/" + "savedLocations/" + location.name).update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error);
    } else {
      console.log("set known location xfer success");
    }
  });
};


export const addDeviceToKnownLocation = (uuid, location, deviceID) => {
  console.log("location: ", location, deviceID)

  fb.database().ref('users/' + uuid + "/settings/" + "savedLocations/" + location.name + "/" + deviceID).update(
    data
  , function(error) {
    if (error) {
      console.log("error could not set data to fb: ", error);
    } else {
      console.log("set known location xfer success");
    }
  });
};