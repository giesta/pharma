import http from "../../http-common";

const getAll = () => {
  return http.get(`/drugs`);
};
const getAllPaginate = (pageNumber) => {
  return http.get(`/drugs/list?page=${pageNumber}`);
};

const get = id => {
  return http.get(`/drugs/${id}`);
};

const create = data => {
  return http.post("/drugs", data);
};

const update = (id, data) => {
  return http.put(`/drugs/${id}`, data);
};

const remove = id => {
  return http.delete(`/drugs/${id}`);
};

const removeAll = () => {
  return http.delete(`/drugs`);
};

const findByTitle = (pageNumber, name) => {
  return http.get(`/drugs/list?page=${pageNumber}&&name=${name}`);
};
const findBySubstance = (name) => {
  return http.get(`/drugs/?name=${name}`);
};
const reports = () => {
  return http.get(`/drugs/reports`);
};
const scrap = () => {
  return http.get(`/drugs/links`);
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
  findBySubstance,
  reports,
  scrap
};

export default services;