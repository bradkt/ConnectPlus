import { SET_LOCATION } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';


export const setLocation = (coords) => {
  console.log("setting places: ", coords)
  return dispatch => {
    dispatch(SET_LOCATION(coords));
    // AsyncStorage.setItem("ap:auth:token", token);
    // AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
    // AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
  };
};