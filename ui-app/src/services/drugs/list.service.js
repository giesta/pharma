import http from "../../http-common";

const getAll = () => {
  return http.get("/drugs");
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

const findByName = name => {
  return http.get(`/drugs?name=${name}`);
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