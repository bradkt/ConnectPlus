import { SET_DEVICES, REMOVE_DEVICE, ADD_SCAN, BLOCK_DEVICE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import { dispatch } from 'rxjs/internal/observable/range';
import fb from "../../services/firebase"

let getTime = () => {
  return Date.now();
}

export const addScan = (uuid, scan) => {
  return dispatch => {
    console.log(scan);
    console.log(getTime());
    return dispatch => {
      
      fb.database().ref('users/' + uuid + "/" + getTime()).set(
        scan
      , function(error) {
        if (error) {
          console.log("error could not set data to fb: ", error)
        } else {
          console.log("data xfer success")
        }
      });
    };
  };
};

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


  export const setDevices = (arry) => {
    return {
      type: SET_DEVICES,
      devices: arry,
    };
  };

