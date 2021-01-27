import axios from "axios";
import { addError } from "./js/actions/index";
import store from "./js/store/index";

const user = JSON.parse(localStorage.getItem('user'));
var token;
if(user && user.access_token){
  token = user.access_token;
}

const {dispatch} = store;

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-type": "application/json",
  }
});
instance.interceptors.request.use (
  function (config) {
    if(JSON.parse(localStorage.getItem('user')) !== null)
      token = JSON.parse(localStorage.getItem('user')).access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject (error);
  }
);
instance.interceptors.response.use(response => {
  return response;
}, err => {
  if(err.response !== undefined && err.response.status === 422){
    dispatch(addError(err.response.data.message.email));
}
  return new Promise((resolve, reject) => {
      const originalReq = err.config;    
      
      if (err.response !== undefined && err.response.status === 401 && err.config && !err.config.__isRetryRequest )
      {
          originalReq._retry = true;

          let res = fetch('http://127.0.0.1:8000/api/auth/refresh', {
              method: 'post',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).access_token
              },
              redirect: 'follow',
              referrer: 'no-referrer',
          }).then(res => res.json()).then(res => {
            if(err.response !== undefined && err.response.status === 401 && res.message==="The token has been blacklisted"){
              localStorage.removeItem("user");
              return window.location.href = '/login';
            }
            else{
              var user = JSON.parse(localStorage.getItem('user'));
              user.access_token = res.access_token;
              localStorage.setItem("user", JSON.stringify(user));
              originalReq.headers['Authorization'] = 'Bearer ' + res.access_token;              
              return axios(originalReq);
            }
              
          });
          resolve(res);
      }
      return Promise.reject(err);
  });
});
export default instance;