import { WHO_OPEN } from "../constants/action-types";

export default (whoIsOpen = true, action) => {
  const { type, payload } = action;

  switch (type) {
    case WHO_OPEN:
      return whoIsOpen ? null : payload;

    default:
      return null;
  }
};
