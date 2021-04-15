import { SELECT } from "../constants/action-types";

export default (selected = false, action) => {
  return action.type === SELECT ? !selected : selected;
};
