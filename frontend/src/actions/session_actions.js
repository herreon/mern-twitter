import * as APIUtil from "../util/session_api_util";
import jwt_decode from "jwt-decode";

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "RECEIVE_USER_LOGOUT";
export const RECEIVE_USER_SIGN_IN = "RECEIVE_USER_SIGN_IN";

// We'll dispatch this when our user signs in
export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

// This will be used to redirect the user to the login page upon signup
export const receiveUserSignIn = () => ({
  type: RECEIVE_USER_SIGN_IN
});

// We dispatch this one to show authentication errors on the frontend
export const receiveErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

// When our user is logged out, we will dispatch this action to set isAuthenticated to false
export const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT
});

// WRITE thunk action to sign up the user
// Upon signup, dispatch the approporiate action depending on which type of response we receieve from the backend
export const signup = user => dispatch => {
  return APIUtil.signup(user)
    .then(() => dispatch(receiveUserSignIn()))
    .catch(err => dispatch(receiveErrors(err.response.data)))
    // err => dispatch(receiveErrors(err.response.data))
}

// Upon login, set the session token and dispatch the current user. Dispatch errors on failure.
export const login = user => dispatch => {
  return APIUtil.login(user)
    .then(res => {
      const { token } = res.data;
      // save our token on localstorage - saves it to the client's browser after the client closes the window.
      localStorage.setItem("jwtToken", token);
      APIUtil.setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(receiveCurrentUser(decoded));
    })
    .catch(err => {
      dispatch(receiveErrors(err.response.data));
    });
}
  

export const logout = () => dispatch => {
  // remove jwt token key off from localstorage
  localStorage.removeItem("jwtToken");
  // remove jwt auth header off of axios as the default
  APIUtil.setAuthToken(false);
  // remove the user from the redux store
  dispatch(logoutUser());
};
