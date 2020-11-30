import http from "../../http-common";

const create = (data) => {
  return http.post(`/comments`, data);
};


export default {
  create
};