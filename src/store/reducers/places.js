import { SET_PLACES, REMOVE_PLACE } from "../actions/actionTypes";

const initialState = {
  places: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
    console.log("set places from places reducer");
      return {
        ...state,
        places: action.places
      };
    case REMOVE_PLACE:
    console.log("get place from places reducer")
      return {
        ...state,
        places: state.places.filter(place => {
          return place.key.toString() !== action.key;
        })
      };
    default:
      return state;
  }
};

export default reducer;
