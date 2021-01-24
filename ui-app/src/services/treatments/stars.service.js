import http from "../../http-common";

const update = (id) => {
  return http.post(`/stars/${id}`);
};

const services = {
  update
}

export default services;