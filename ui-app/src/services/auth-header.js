export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.access_token) {
      //alert(localStorage.getItem('user'));
    return { 
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
      Authorization: 'Bearer ' + user.access_token
  };
  } else {
    return {};
  }
}