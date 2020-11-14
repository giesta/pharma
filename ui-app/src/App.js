import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProtectedRoute from "./services/private-route"
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import DrugsList from "./components/drugs/drugs-list.component";
import DiseasesList from "./components/diseases/diseases-list.component";
import TreatmentsList from "./components/treatments/treatments-list.component";
import Treatment from "./components/treatments/treatment.component";
import UsersList from "./components/users/users-list.component";
import Footer from "./components/layout/footer.component";
import MainNavbar from "./components/layout/navbar.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showPharmacistBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if(user){
      this.setState({        
        currentUser: user,
        showAdminBoard: user.user.role==="admin",
        showPharmacistBoard: user.user.role==="pharmacist",
      });
    }
      
  }

  logOut() {
    AuthService.logout();
  } 

  render() {
    const { currentUser, showPharmacistBoard, showAdminBoard } = this.state;

    return (
      
      <div>

   {MainNavbar(showPharmacistBoard, showAdminBoard, currentUser, this.logOut)} 

        <div className="container main-container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute exact path="/profile" component={Profile} roles={["admin", "pharmacist"]}/> 
            <ProtectedRoute path="/user" component={BoardUser} roles={["admin", "pharmacist"]}/> 
            <ProtectedRoute exact path="/drugs" component={DrugsList} roles={["admin", "pharmacist"]}/> 
            <ProtectedRoute exact path="/diseases" component={DiseasesList} roles={["admin", "pharmacist"]}/> 
            <ProtectedRoute exact path="/treatments" component={TreatmentsList} roles={["admin", "pharmacist"]}/> 
            <Route exact path="/treatments/:id" component={Treatment}/>            
            <ProtectedRoute path="/users" component={UsersList} roles={["admin"]}/>
          </Switch>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

export default App;