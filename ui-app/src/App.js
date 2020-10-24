import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Navbar, NavItem, NavDropdown, MenuItem, Nav } from 'react-bootstrap';


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

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if(user){
      this.setState({
        currentUser: user,
      });
    }
      
  }

  logOut() {
    AuthService.logout();
  }

  

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      
      <div>
   <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="https://www.youtube.com/watch?v=6B_6K-splRU">Code Of Universe</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">

    <Nav className="mr-auto">
    <Nav.Link href={"/"}>Home</Nav.Link>
      <Nav.Link href={"/drugs"}>Drugs</Nav.Link>
      <Nav.Link href={"/diseases"}>Diseases</Nav.Link>
      <Nav.Link href={"/treatments"}>Treatments</Nav.Link>
      <Nav.Link href="#pricing">Pricing</Nav.Link>
      <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    
    {currentUser ? (
      <Nav>
              <Nav.Link href={"/profile"}>{currentUser.user.name}</Nav.Link>
              <Nav.Link eventKey={2} href="/login" onClick={this.logOut}>
              LogOut
      </Nav.Link>
      </Nav>
          ) : (
<Nav>
              <Nav.Link href={"/login"}>Login</Nav.Link>
              <Nav.Link eventKey={2} href={"/register"}>
              Sign Up
      </Nav.Link>
      </Nav>            
          )}
    
  </Navbar.Collapse>
</Navbar>        
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route exact path="/drugs" component={DrugsList} />
            <Route exact path="/diseases" component={DiseasesList} />
            <Route exact path="/treatments" component={TreatmentsList} />
            <Route exact path="/treatments/:id" component={Treatment} />
          </Switch>
        </div>
        <footer className='footer mt-auto py-3 bg-dark text-white'>
        <div className='container'>Place sticky footer content here.</div>
      </footer>
      </div>
    );
  }
}

export default App;