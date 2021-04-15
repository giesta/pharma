import http from "../../http-common";

const update = (id) => {
  return http.put(`/reports/${id}`);
};

const services = {
  update
}

export default services;