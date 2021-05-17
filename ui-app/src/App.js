import React, { Component } from "react";
import { Switch, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProtectedRoute from "./services/private-route"
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import DrugsList from "./components/drugs/drugs-list.component";
import DrugsInteractions from "./components/drugs/interactions.component";
import DiseasesList from "./components/diseases/diseases-list.component";
import TreatmentsList from "./components/treatments/treatments-list.component";
import Treatment from "./components/treatments/treatment.component";
import UsersList from "./components/users/users-list.component";

import Diagram from "./components/diagrams/diagrams-list.component";
import CreateDiagram from "./components/diagrams/diagram.component";

import Footer from "./components/layout/footer.component";
import MainNavbar from "./components/layout/navbar.component";

import Loadable from "react-loadable";

import Logo from "./components/admin/Logo/Logo.js";
import Header from "./components/admin/Header/Header.js";
import Basic from "./components/admin/Routes/Basic/Basic.js";
import Manage from "./components/admin/Routes/Manage/Manage.js";
import Reports from "./components/admin/Routes/Reports/Reports.js";
import Settings from "./components/admin/Routes/Settings/Settings.js";
import AdminProfile from "./components/admin/Routes/Profile/Profile.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this);

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
        showAdminBoard: user.role==="admin",
        showPharmacistBoard: user.role==="pharmacist",
      });
    }      
  }

  logOut() {
    AuthService.logout();
    this.setState({        
      currentUser: undefined,
      showAdminBoard: false,
      showPharmacistBoard: false,
    });
  } 
  logIn() {
    const user = AuthService.getCurrentUser();
    if(user){
      this.setState({        
        currentUser: user,
        showAdminBoard: user.role==="admin",
        showPharmacistBoard: user.role==="pharmacist",
      });
    }
  }

  render() {
    const { currentUser, showPharmacistBoard, showAdminBoard } = this.state;

    return (     
      <div>
        {
        showAdminBoard?(
          <div className="admin-container">
        <div className="kanban-wrapper">
        <div className="kanban">
          <Logo />
          <Header logOut = {this.logOut}/>
          <Sidebar />
            <Switch>
              <ProtectedRoute exact path="/manage" component={Manage} roles={["admin"]}/>
              <ProtectedRoute exact path="/settings" component={Settings} roles={["admin"]}/>
              <ProtectedRoute exact path="/admin" component={AdminProfile} roles={["admin"]}/>
            </Switch>
        </div>
      </div>
      </div>
      ):(<>
      <MainNavbar showPharmacistBoard = {showPharmacistBoard} showAdminBoard = {showAdminBoard} currentUser = {currentUser} logOut = {this.logOut} />

        <div className="container main-container mt-3">
            <Switch>
              <ProtectedRoute exact path={["/","/home"]} component={Home} roles={["pharmacist"]}/>
              <Route exact path="/login" render={(props) => <Login logIn = {this.logIn} {...props}/>} />
              <Route exact path="/register" render={(props) => <Register logIn = {this.logIn} {...props}/>}/>           
              <ProtectedRoute exact path="/profile" component={Profile} roles={["pharmacist"]}/> 
              <ProtectedRoute exact path="/drugs" component={DrugsList} roles={["pharmacist"]}/> 
              <ProtectedRoute exact path="/diseases" component={DiseasesList} roles={["pharmacist"]}/> 
              <ProtectedRoute exact path="/treatments" component={TreatmentsList} roles={["pharmacist"]}/> 
              <ProtectedRoute exact path="/diagrams" component={Diagram} roles={["pharmacist"]}/>
              <ProtectedRoute exact path="/interactions" component={DrugsInteractions} roles={["pharmacist"]}/>
              <ProtectedRoute exact path="/diagrams/create" component={CreateDiagram} roles={["pharmacist"]}/>
              <ProtectedRoute exact path="/diagrams/update" component={CreateDiagram} roles={["pharmacist"]}/>
              <ProtectedRoute exact path="/treatment" component={Treatment} roles={["pharmacist"]}/>
            </Switch>
        </div>
        
        </>
      )
      }
      <Footer></Footer>
</div>
   
    );
  }
}

const Loading = () => <div className="loading">Loading...</div>;

const Sidebar = Loadable({
  loader: () => import("./components/admin/Sidebar/Sidebar.js"),
  loading: Loading
});

export default App;