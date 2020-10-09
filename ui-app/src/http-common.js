import axios from "axios";
import authHeader from './services/auth-header';

const user = JSON.parse(localStorage.getItem('user'));
var token;
if(user && user.access_token){
  token = user.access_token;
}
export default axios.create({
  baseURL: "http://20.52.35.177:5000/api",
  headers: {
    "Content-type": "application/json",
    Authorization: 'Bearer ' + token
  }
});