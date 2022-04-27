import { combineReducers } from "redux";

import GlobalStates from "./reducers/GlobalStates";

const rootReducer = combineReducers({
  GlobalStates,
});

export default rootReducer;
