import axios from "axios";
import { addError } from "./js/actions/index";
import store from "./js/store/index";

var token = localStorage.getItem('token');


const {dispatch} = store;

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});
instance.interceptors.request.use (
  function (config) {
    if(localStorage.getItem('token') !== null)
      token = localStorage.getItem('token');
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
else if(err.response !== undefined && err.response.status === 409){
  if(err.response.data.message==="Could not delete the diagram"){
    dispatch(addError("Negalima pašalinti diagramos, nes yra susijusių gydymo algoritmų."));
  }else if(err.response.data.message==="Could not delete the overview"){
    dispatch(addError("Negalima pašalinti ligos aprašymo, nes yra susijusių gydymo algoritmų."));
  }else{
    dispatch(addError(err.response.data.message));
  }  
}else if(err.response !== undefined && err.response.status === 400){
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
                  Authorization: 'Bearer ' + localStorage.getItem('token')
              },
              redirect: 'follow',
              referrer: 'no-referrer',
          }).then(res => res.json()).then(res => {
            if(err.response !== undefined && err.response.status === 401 && res.message==="The token has been blacklisted"){
              localStorage.removeItem("user");
              localStorage.removeItem("token"); 
              return window.location.href = '/login';
            }
            else{
              localStorage.setItem("token", res.access_token);
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