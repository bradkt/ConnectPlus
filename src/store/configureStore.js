import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import locationReducer from './reducers/location';
import devicesReducer from './reducers/devices';
import uiReducer from "./reducers/ui";
import authReducer from "./reducers/auth";

const rootReducer = combineReducers({
  location: locationReducer,
  devices: devicesReducer,
  ui: uiReducer,
  auth: authReducer
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;