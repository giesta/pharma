import { 
  ADD_ERROR, 
  REMOVE_ERROR, 
  ADD_TASK,
  BOARD_OPEN,
  DELETE_TASK,
  WHO_OPEN,
  DRAG_AND_DROP,
  SELECT } from "../constants/action-types";


export function addError(payload) {
    return { type: ADD_ERROR, payload }
  };

export function removeError() {
  return { type: REMOVE_ERROR }
};
export function boardOpen() {
  return {
    type: BOARD_OPEN
  };
}

export function addTask(task) {
  return {
    type: ADD_TASK,
    payload: { task },
    generateId: true
  };
}

export function whoIsOpen(type) {
  return {
    type: WHO_OPEN,
    payload: type
  };
}

export function deleteTask(id) {
  return {
    type: DELETE_TASK,
    payload: { id }
  };
}

export function dragAndDrop(ev, cat) {
  return {
    type: DRAG_AND_DROP,
    payload: { ev, cat }
  };
}

export function selected() {
  return {
    type: SELECT
  };
}
