import http from "../../http-common";

const scrap = () => {
  return http.get(`/scrap`);
};
const getAll = () => {
    return http.get(`/symptoms`);
  };
const getAllPaginate = (pageNumber) => {
  return http.get(`/symptoms/list?page=${pageNumber}`);
};

const get = id => {
  return http.get(`/symptoms/${id}`);
};

const create = data => {
  return http.post("/symptoms", data);
};

const update = (id, data) => {
  return http.put(`/symptoms/${id}`, data);
};

const remove = id => {
  return http.delete(`/symptoms/${id}`);
};

const removeAll = () => {
  return http.delete(`/symptoms`);
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