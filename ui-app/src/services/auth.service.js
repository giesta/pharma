import axios from "axios";

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
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, email, password, c_password) {
    return axios.post(API_URL + "register", {
      name,
      email,
      password,
      c_password,
    });
  }

  getCurrentUser() {
      //console.log(localStorage.getItem('user'));
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();