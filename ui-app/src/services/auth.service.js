import axios from "axios";
import jwt_decode from "jwt-decode";
import http from "../http-common";

const API_URL = "http://127.0.0.1:8000/api/auth/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.access_token) { 
          localStorage.setItem("token", response.data.access_token);              
          localStorage.setItem("user", JSON.stringify(jwt_decode(response.data.access_token).user));
        }
        return jwt_decode(response.data.access_token).user;
      });
  }

  logout() {
    return http
      .post(API_URL + "logout",{},{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        if (response.data.success) { 
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      });    
  }

  register(name, last_name, stamp_number, email, password, c_password) {
    return axios.post(API_URL + "register", {
      name,
      last_name,
      stamp_number,
      email,
      password,
      c_password,
    }).then(response => {
      if (response.data.access_token) { 
        localStorage.setItem("token", response.data.access_token);           
        localStorage.setItem("user", JSON.stringify(jwt_decode(response.data.access_token).user));
      }
      return response;
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();