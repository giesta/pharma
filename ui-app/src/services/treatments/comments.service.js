import http from "../../http-common";

const create = (data) => {
  return http.post(`/comments`, data);
};

const services = {
  create
};
export default services;