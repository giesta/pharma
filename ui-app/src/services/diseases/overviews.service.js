import http from "../../http-common";

const getAll = () => {
  return http.get(`/overviews`);
};
const getAllPaginate = (pageNumber) => {
  return http.get(`/overviews/list?page=${pageNumber}`);
};

const get = id => {
  return http.get(`/overviews/${id}`);
};

const create = data => {
  return http.post("/overviews", data);
};

const update = (id, data) => {
  return http.put(`/overviews/${id}`, data);
};

const remove = id => {
  return http.delete(`/overviews/${id}`);
};

const removeAll = () => {
  return http.delete(`/overviews`);
};

const findByTitle = (pageNumber, name) => {
  return http.get(`/overviews/list?page=${pageNumber}&&name=${name}`);
};

const services = {
  getAll,
  getAllPaginate,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};

export default services;