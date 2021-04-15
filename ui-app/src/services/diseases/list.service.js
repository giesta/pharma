import http from "../../http-common";

const getAll = () => {
  return http.get(`/diseases`);
};
const getAllPaginate = (pageNumber) => {
  return http.get(`/diseases/list?page=${pageNumber}`);
};

const get = id => {
  return http.get(`/diseases/${id}`);
};

const create = data => {
  return http.post("/diseases", data);
};

const update = (id, data) => {
  return http.put(`/diseases/${id}`, data);
};

const remove = id => {
  return http.delete(`/diseases/${id}`);
};

const removeAll = () => {
  return http.delete(`/diseases`);
};

const findByTitle = (name) => {
  return http.get(`/diseases/list?name=${name}`);
};

const reports = () => {
  return http.get(`/diseases/reports`);
};

const services = {
  getAll,
  getAllPaginate,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  reports
};

export default services;