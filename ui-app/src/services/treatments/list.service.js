import http from "../../http-common";
import httpPublic from "../../http-public";


const getAllPublic = (pageNumber) => {
  return httpPublic.get(`/treatments?page=${pageNumber}`);
};

const getAllPaginate = (pageNumber) => {
  return http.get(`/treatments/list?page=${pageNumber}`);
};
const getAll = () => {
  return http.get(`/treatments`);
};

const get = id => {
  return http.get(`/treatments/${id}`);
};

const getPublic = id => {
  return httpPublic.get(`/treatments/${id}`);
};

const create = data => {
  return http.post("/treatments", data);
};

const update = (id, data) => {
  return http.post(`/treatments/${id}`, data);
};

const remove = id => {
  return http.delete(`/treatments/${id}`);
};

const removeAll = () => {
  return http.delete(`/treatments`);
};

const findByTitle = (pageNumber, name) => {
  return http.get(`/treatments/list?page=${pageNumber}&&name=${name}`);
};
const findByTitlePublic = (pageNumber, name) => {
  return http.get(`/treatments/list?page=${pageNumber}&&name=${name}`);
};
const findByTitlePrivate = (pageNumber, name) => {
  return http.get(`/treatments/private?page=${pageNumber}&&name=${name}`);
};

const services = {
  getAllPublic,
  getAllPaginate,
  getPublic,
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  findByTitlePublic,
  findByTitlePrivate
};

export default services;
  