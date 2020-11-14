import http from "../../http-common";
import httpPublic from "../../http-public";


const getAllPublic = () => {
  return httpPublic.get("/treatments");
};

const getAll = () => {
  return http.get("/treatments");
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

const findByName = name => {
  return http.get(`/treatments?name=${name}`);
};

export default {
  getAllPublic,
  getPublic,
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName
};