import { combineReducers } from "redux";
import {
  reducer as editorReducer,
  SLICE_NAME as editorSliceName
} from "./modules/editor";

const rootReducer = combineReducers({
  [editorSliceName]: editorReducer
});

export default rootReducer;
