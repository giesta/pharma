import http from "../../http-common";

const update = (id) => {
  return http.post(`/stars/${id}`);
};


export default {
  update
};