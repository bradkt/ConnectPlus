import { AsyncStorage } from "react-native";
import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { API_KEY } from "../../utility/api_env";
import { uiStartLoading, uiStopLoading } from "./index";
import App from "../../../App";

export const tryAuth = (authData, authMode) => {
    return dispatch => {
      dispatch(uiStartLoading());
    };
  };

export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {
      const now = new Date();
      const expiryDate = now.getTime() + expiresIn * 1000;
      dispatch(authSetToken(token, expiryDate));
      // AsyncStorage.setItem("ap:auth:token", token);
      // AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
      // AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
    };
  };

export const authSetToken = (token, expiryDate) => {
    return {
      type: AUTH_SET_TOKEN,
      token: token,
      expiryDate: expiryDate
    };
  };

  export const authGetToken = () => {
    return (dispatch, getState) => {
      
    };
  };

  export const authAutoSignIn = () => {
    return dispatch => {
      // dispatch(authGetToken())
      //   .then(token => {
      //     startMainTabs();
      //   })
      //   .catch(err => console.log("Failed to fetch token!"));
    };
  };
  
  export const authClearStorage = () => {
    return dispatch => {
      // AsyncStorage.removeItem("ap:auth:token");
      // AsyncStorage.removeItem("ap:auth:expiryDate");
      // return AsyncStorage.removeItem("ap:auth:refreshToken");
    };
  };
  
  export const authLogout = () => {
    return dispatch => {
      // dispatch(authClearStorage()).then(() => {
      //   App();
      // });
      // dispatch(authRemoveToken());
    };
  };
  
  export const authRemoveToken = () => {
    return {
      type: AUTH_REMOVE_TOKEN
    };
  };