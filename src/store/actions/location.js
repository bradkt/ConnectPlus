import { SET_LOCATION } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const setLocation = () => {
    console.log("setting Location");
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