import { SET_DEVICES, INIT_DEVICES_ASYNC } from "../actions/actionTypes";
import { AsyncStorage } from 'react-native';

const initialState = {
  currentLocationdevices: [],
  dbDevices: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICES:
      return {
        ...state,
        dbDevices: action.data
      };
    default:
      return state;
  }
};

export default reducer;
