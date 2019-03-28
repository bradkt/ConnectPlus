import { SET_DEVICES, REMOVE_DEVICE, ADD_SCAN, BLOCK_DEVICE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import { dispatch } from 'rxjs/internal/observable/range';
import firebase from "../../services/firebase"

export const addScan = (uuid, scan) => {
  return dispatch => {
    fetch("https://fb-rnplay.firebaseio.com/users.json", {
      method: "POST",
      body: JSON.stringify(scan)
    })
    .catch(err => {
      console.log("add scan error: ", err);
    })
    .then(res => {
      res.json();
      console.log("res: ", res.json())
    })
    .then(parsedRes => {
      console.log("----parsedRes--- ");
      console.log(parsedRes);
    })
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

