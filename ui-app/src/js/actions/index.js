import { ADD_ERROR, REMOVE_ERROR } from "../constants/action-types";


export function addError(payload) {
    return { type: ADD_ERROR, payload }
  };

export function removeError() {
  return { type: REMOVE_ERROR }
};