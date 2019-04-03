import { SET_LOCATION } from "../actions/actionTypes";

const initialState = {
  location: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
    console.log("set places from places reducer");
      return {
        ...state,
        places: action.places
      };
    default:
      return state;
  }
};

export default reducer;
