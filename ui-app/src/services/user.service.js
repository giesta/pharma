import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:8000/api/auth';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/me', { headers: authHeader()}, {token: localStorage.getItem('user').access_token});
  }

  getCurrentUser() {
    return this.getPublicContent();
  }

}
export default new UserService();