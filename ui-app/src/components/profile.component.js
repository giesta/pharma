import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser:AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
              {console.log(currentUser)}
            <strong>{currentUser.user.name}</strong> Profile
          </h3>
        </header>
        <div className="row top-buffer">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col cell" style={{"wordWrap": "break-word"}}> <p>
            <strong>Token:</strong>{" "}
                </p>{currentUser.access_token}{" "}
                    <p>
                    <strong>Id:</strong>{" "}
                    {currentUser.user.id}
                    </p>
                    <p>
                    <strong>Email:</strong>{" "}
                    {currentUser.user.email}
                    </p>
                    <strong>Authorities:</strong>
                    <ul>
                    {currentUser.user.role}
                    </ul>
            </div>
        </div>
       
            
          
      </div>
    );
  }
}