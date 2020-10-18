import http from "../../http-common";

const getAll = () => {
  return http.get("/diseases");
};

const get = id => {
  return http.get(`/diseases/${id}/drugs`);
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
  get,
  create,
  update,
  remove,
  removeAll,
  findByName
};