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
import BoardUser from "./components/board-user.component";
import DrugsList from "./components/drugs/drugs-list.component";
import DiseasesList from "./components/diseases/diseases-list.component";
import TreatmentsList from "./components/treatments/treatments-list.component";
import Treatment from "./components/treatments/treatment.component";
import UsersList from "./components/users/users-list.component";
import Footer from "./components/layout/footer.component";
import MainNavbar from "./components/layout/navbar.component";

import Loadable from "react-loadable";

import Logo from "./components/admin/Logo/Logo.jsx";
import Header from "./components/admin/Header/Header.jsx";
import Basic from "./components/admin/Routes/Basic/Basic.jsx";
import Manage from "./components/admin/Routes/Manage/Manage.jsx";
import Reports from "./components/admin/Routes/Reports/Reports.jsx";
import Schedule from "./components/admin/Routes/Schedule/Schedule.jsx";
import Settings from "./components/admin/Routes/Settings/Settings.jsx";

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
        showAdminBoard: user.role==="admin",
        showPharmacistBoard: user.role==="pharmacist",
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
        {
        showAdminBoard?(
        <div className="kanban-wrapper">
        <div className="kanban">
          <Logo />
          <Header />
          <Sidebar />
          <Switch>
            <Route exact path="/" component={Basic} />
            <Route path="/manage" component={Manage} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </div>
      ):(<>
      <MainNavbar showPharmacistBoard = {showPharmacistBoard} showAdminBoard = {showAdminBoard} currentUser = {currentUser} logOut = {this.logOut} />

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
        </>
      )
      }
</div>
   
    );
  }
}

const Loading = () => <div className="loading">Loading...</div>;

const Sidebar = Loadable({
  loader: () => import("./components/admin/Sidebar/Sidebar.jsx"),
  loading: Loading
});

export default App;