import { combineReducers } from "redux";
import {
  reducer as editorReducer,
  EditorStateSlice as EditorState
} from "./modules/Editor/redux";

export type ReduxState = EditorState;

const rootReducer = combineReducers<ReduxState>({
  editor: editorReducer
});

export default rootReducer;
