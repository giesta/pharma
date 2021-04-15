import http from "../../http-common";

const getAll = () => {
  return http.get(`/diagrams`);
};

const get = id => {
  return http.get(`/diagrams/${id}`);
};

const create = data => {
  return http.post("/diagrams", data);
};

const update = (id, data) => {
  return http.put(`/diagrams/${id}`, data);
};

const remove = id => {
  return http.delete(`/diagrams/${id}`);
};

const findByTitle = (pageNumber, name) => {
  return http.get(`/diagrams/list?page=${pageNumber}&&name=${name}`);
};

const services = {
  getAll,
  get,
  create,
  update,
  remove,
  findByTitle
};

export default services;