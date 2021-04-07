import React, { Component } from "react";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      token: localStorage.getItem('token')
    };
  }

  render() {
    const { currentUser, token } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.name}</strong> Profile
          </h3>
        </header>
        <div className="row top-buffer">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col cell" style={{"wordWrap": "break-word"}}> <p>
            <strong>Token:</strong>{" "}
                </p>{token}{" "}
                    <p>
                    <strong>Id:</strong>{" "}
                    {currentUser.id}
                    </p>
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
       
            
          
      </div>
    );
  }
}