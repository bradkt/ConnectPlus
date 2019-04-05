import { SET_LOCATION } from "../actions/actionTypes";

const initialState = {
  location: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        location: action.coords
      };
    default:
      return state;
  }
};

export default reducer;
