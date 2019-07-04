import { SET_USER_PROFILE, SET_USER_SETTINGS } from "../actions/actionTypes";

const initialState = {
  settings: {},
  profile: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_SETTINGS:
    console.log("set user settings");
    return {
      ...state,
      location: action.data
    };
    case SET_USER_PROFILE:
    console.log("set user profile");
    return {
      ...state,
      location: action.data
    };
    default:
      return state;
  }
};

export default reducer;
