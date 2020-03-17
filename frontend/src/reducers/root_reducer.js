// src/reducers/root_reducer.js

import { combineReducers } from "redux";
import session from "./session_reducer.js";
import tweets from "./tweets_reducer.js"
;import errors from "./errors_reducer.js";

const RootReducer = combineReducers({
  session,
  tweets,
  errors
});

export default RootReducer;
