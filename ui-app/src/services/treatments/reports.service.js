import http from "../../http-common";

const report = (id) => {
  return http.post(`/report/${id}`);
};

const services = {
  report
}

export default services;