import { SET_DEVICES, INIT_DEVICES_ASYNC, BLOCK_DEVICE } from "../actions/actionTypes";
import { AsyncStorage } from 'react-native';

const initialState = {
  currentLocationdevices: [],
  blockedDevices: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICES:
    console.log("set devices from device reducer");
    //AsyncStorage.setItem("devices", action.devices);
      return {
        ...state,
        devices: action.devices
      };
    case INIT_DEVICES_ASYNC:
    console.log("init async from device reducer");
      return {
        ...state
      };
    case BLOCK_DEVICE:
    console.log("block device from data collection");
      return {
        ...state
      };
    default:
      return state;
  }
};

export default reducer;
