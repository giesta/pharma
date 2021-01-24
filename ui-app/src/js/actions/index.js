import { ADD_ERROR } from "../constants/action-types";


export function addError(payload) {
    return { type: ADD_ERROR, payload }
  };