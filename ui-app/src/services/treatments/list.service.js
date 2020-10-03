import http from "../../http-common";

const getAll = () => {
  return http.get("/treatments");
};

const get = id => {
  return http.get(`/treatments/${id}`);
};

const create = data => {
  return http.post("/treatments", data);
};

const update = (id, data) => {
  return http.put(`/treatments/${id}`, data);
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
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName
};