import axios from "axios";
import authHeader from './services/auth-header';

export default axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-type": "application/json"}
});