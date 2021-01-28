import { ADD_ERROR, REMOVE_ERROR } from "../constants/action-types";


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
  
  export default rootReducer;