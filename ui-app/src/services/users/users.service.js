import http from "../../http-common";

const getAllPaginate = (pageNumber) => {
  return http.get(`/users/list?page=${pageNumber}`);
};
const getAll = () => {
  return http.get(`/users`);
};

const get = id => {
  return http.get(`/users/${id}`);
};

const create = data => {
  return http.post("/users", data);
};

const update = (id, data) => {
  return http.put(`/users/${id}`, data);
};

const remove = id => {
  return http.delete(`/users/${id}`);
};

const removeAll = () => {
  return http.delete(`/users`);
};

const findByName = name => {
  return http.get(`/users?name=${name}`);
};

export default {
  getAll,
  getAllPaginate,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName
};