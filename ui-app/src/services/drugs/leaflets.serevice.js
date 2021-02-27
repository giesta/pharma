import http from "../../http-common";

const getAll = () => {
  return http.get(`/leaflets`);
};
const getAllPaginate = (pageNumber) => {
  return http.get(`/leaflets/list?page=${pageNumber}`);
};

const get = id => {
  return http.get(`/leaflets/${id}`);
};

const create = data => {
  return http.post("/leaflets", data);
};

const update = (id, data) => {
  return http.put(`/leaflets/${id}`, data);
};

const remove = id => {
  return http.delete(`/leaflets/${id}`);
};

const removeAll = () => {
  return http.delete(`/leaflets`);
};

const findByTitle = (pageNumber, name) => {
  return http.get(`/leaflets/list?page=${pageNumber}&&name=${name}`);
};
const findBySubstance = (name) => {
  return http.get(`/leaflets?name=${name}`);
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
  findBySubstance
};

export default services;