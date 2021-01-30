import { ADD_ERROR, REMOVE_ERROR } from "../constants/action-types";
import board from "./board";
import tasks from "./tasks";
import selected from "./selected";
import whoIsOpen from "./whoIsOpen";
import { combineReducers } from "redux";


const initialState = {
    errors: []
  };
  
  function rootReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_ERROR:
        return Object.assign({}, state, {
          errors: state.errors.concat(action.payload)
        });
      case REMOVE_ERROR:
        return initialState;     
      default:
        return state;
    }
  };
  
  export default combineReducers({
    board,
    tasks,
    whoIsOpen,
    selected,
    rootReducer
  });