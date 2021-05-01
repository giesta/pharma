import http from "../../http-common";

const rate = (id) => {
  return http.post(`/rate/${id}`);
};

const services = {
  rate
}

export default services;