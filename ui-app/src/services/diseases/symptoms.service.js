import http from "../../http-common";

const scrap = () => {
  return http.get(`/scrap`);
};
const getAll = () => {
    return http.get(`/symptoms`);
  };

const create = data => {
  return http.post("/symptoms", data);
};

const findByTitle = (name) => {
  return http.get(`/symptoms?name=${name}`);
};
const reports = () => {
  return http.get(`/symptoms/reports`);
};

const services = {
  getAll,
  create,
  scrap,
  findByTitle,
  reports
};

export default services;