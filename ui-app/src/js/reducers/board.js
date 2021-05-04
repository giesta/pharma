
import { BOARD_OPEN } from "../constants/action-types";

 const fn = (board = true, action) => {
  return action.type === BOARD_OPEN ? !board : board;
};
export default fn;