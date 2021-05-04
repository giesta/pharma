import { SELECT } from "../constants/action-types";

 const selected = (selected = false, action) => {
  return action.type === SELECT ? !selected : selected;
};
export default selected;