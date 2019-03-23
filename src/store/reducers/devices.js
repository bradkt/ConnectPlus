import { SET_DEVICES, REMOVE_DEVICE, ADD_DEVICE } from "../actions/actionTypes";
import { AsyncStorage } from 'react-native';

const initialState = {
  devices: []
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
    case REMOVE_DEVICE:
    console.log("remove device from device reducer");
      return {
        ...state
      };
    default:
      return state;
  }
};

export default reducer;
