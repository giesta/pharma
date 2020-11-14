import http from "../../http-common";
import httpPublic from "../../http-public";

const getAll = () => {
  return http.get("/diseases");
};

const getPublic = id => {
  return httpPublic.get(`/diseases/${id}/drugs`);
};

const create = (id, data) => {
  return http.post(`/diseases/${id}/drugs`, data);
};

const update = (id, drug_id, data) => {
  return http.put(`/diseases/${id}/drugs/${drug_id}`, data);
};

const remove = (id) => {
  return http.delete(`/diseases/${id}/drugs`);
};

const removeAll = () => {
  return http.delete(`/diseases`);
};

const findByName = name => {
  return http.get(`/diseases?name=${name}`);
};

export default {
  getAll,
  getPublic,
  create,
  update,
  remove,
  removeAll,
  findByName
};