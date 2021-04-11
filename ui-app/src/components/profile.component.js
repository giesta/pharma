import React, { Component, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserUpdate from "./users/update-modal.component";
import { BsPencilSquare} from "react-icons/bs";
import { removeError } from "../js/actions/index";
import store from "../js/store/index";
import UsersDataService from "../services/users/users.service";

export default function Profile() {

  const initialUserState = {  
    username: "",
    email: "",
    password:'',
  };

  const [user, setUser] = React.useState(initialUserState);
  const [show, setShow] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(AuthService.getCurrentUser());
  const [validated, setValidated] = React.useState(false);

  const [error, setError] = React.useState(false);
  const {dispatch} = store;

  const handleSubmit = (form) => {
    updateUser(form);       
  };

  const handleClose = () =>{
    setShow(false);
    setValidated(false);    
    setError(false);
    dispatch(removeError());
  };

  const updateUser = (form) => {
    var data = {
      id: currentUser.id,
      email: form.email,
    };
    if(form.password!==''){
      data['password'] = form.password;
    }
    console.log(data);
    UsersDataService.update(data.id, data)
      .then(response => {
        console.log(response.data);
        setUser({
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,        
        });
        setCurrentUser({...currentUser, email:response.data.data.email});
        console.log(currentUser);
        let value = currentUser;
        value['email'] = response.data.data.email;
        localStorage.setItem('user', JSON.stringify(value));
        handleClose();
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.name}</strong> Profile
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setUser(currentUser); setShow(true)}}>
                <BsPencilSquare/>
            </button>
          </h3>
        </header>
        <div className="row top-buffer">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col cell" style={{"wordWrap": "break-word"}}>
                                
                    <p>
                    <strong>Email:</strong>{" "}
                    {currentUser.email}
                    </p>
                    <strong>Authorities:</strong>
                    <ul>
                    {currentUser.role}
                    </ul>
            </div>
        </div>
       {show?(
         <UserUpdate error={error} show ={show} handleClose={handleClose} user={user} validated={validated} handleSubmit={handleSubmit}></UserUpdate>
       ):''}
            
          
      </div>
    );
  };
