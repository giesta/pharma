import { ADD_ERROR } from "../constants/action-types";


const initialState = {
    errors: []
  };
  
  function rootReducer(state = initialState, action) {
    if (action.type === ADD_ERROR) {
        return Object.assign({}, state, {
            errors: state.errors.concat(action.payload)
        });
    }
    return state;
  };
  
  export default rootReducer;