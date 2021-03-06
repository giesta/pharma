import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import jwt_decode from "jwt-decode";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Šis laukas yra privalomas!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Elektroninio pašto adresas netinkamo formato.
      </div>
    );
  }
};

const vName = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Vardas gali būti nuo 3 iki 20 simbolių.
      </div>
    );
  }
};
const vLastName = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Pavardė gali būti nuo 3 iki 20 simbolių.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Slaptažodis turi būti nuo 6 iki 40 simbolių.
      </div>
    );
  }
};
const c_password = value => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          Slaptažodis turi būti nuo 6 iki 40 simbolių.
        </div>
      );
    }
  };

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeStampNumber = this.onChangeStampNumber.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeCPassword = this.onChangeCPassword.bind(this);

    this.state = {
      name: "",
      last_name:"",
      stamp_number:"",
      email: "",
      password: "",
      c_password: "",
      successful: false,
      message: "",
      redirect: false
    };
  }
  vconfirmPassword = (confirm_password) => {
    if (this.state.password !== undefined && confirm_password !== undefined) {
      if (this.state.password !== confirm_password) {
      return (
        <div className="alert alert-danger" role="alert">
          Slaptažodžiai nesutampa.
        </div>
      );
    }
  };
}
setRedirect= ()=>{
  this.setState({
    redirect: true
  })
}

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  onChangeLastName(e) {
    this.setState({
      last_name: e.target.value
    });
  }
  onChangeStampNumber(e) {
    this.setState({
      stamp_number: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  onChangeCPassword(e) {
    this.setState({
      c_password: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.name,
        this.state.last_name,
        this.state.stamp_number,
        this.state.email,
        this.state.password,
        this.state.c_password,
      ).then(
        response => {
          this.setState({
            message: [jwt_decode(response.data.access_token).user.name],
            successful: true
          });
          this.props.history.replace('/profile', 'urlhistory');
          this.props.logIn();
          this.props.history.push("/profile");          
        },
        error => {
          var resMessage ="";
          if(error.response!==undefined && error.response.data!==undefined&&error.response.data.message!==undefined){
            if(error.response.data.message.email!==undefined){
              resMessage=error.response.data.message.email;
            }else if(error.response.data.message.name!==undefined){
              resMessage=error.response.data.message.name;
            }else if(error.response.data.message.last_name!==undefined){
              resMessage=error.response.data.message.last_name;
            }else if(error.response.data.message.password!==undefined){
              resMessage=error.response.data.message.password;
            }else{
              resMessage=error.response.data.message;
            }
          }else if(error.message!==undefined){
            resMessage=error.message;
          }else{
            resMessage=error.toString();
          }
          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="name">Vardas</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeName}
                    validations={[required, vName]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Pavardė</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={this.state.last_name}
                    onChange={this.onChangeLastName}
                    validations={[required, vLastName]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stamp_number">Spaudo numeris</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="stamp_number"
                    value={this.state.stamp_number}
                    onChange={this.onChangeStampNumber}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">El. pašto adresas</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Slaptažodis</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Patvirtinti slaptažodį</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.c_password}
                    onChange={this.onChangeCPassword}
                    validations={[required, c_password, this.vconfirmPassword]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-dark btn-block">Užsiregistruoti</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {Array.isArray(this.state.message)?this.state.message.map(item=>item):this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}