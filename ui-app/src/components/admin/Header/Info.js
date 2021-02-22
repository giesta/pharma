import React from "react";
import { Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsBoxArrowRight, BsPeopleCircle } from "react-icons/bs";
import AuthService from "../../../services/auth.service";

function  Info() {
  function logOut() {
    AuthService.logout();
  } 
  const user = AuthService.getCurrentUser();
    return (
      <React.Fragment>
        <div className="name-user">{user.user.name}</div>
        <div className="avatar-user">          
          <Navbar brand='React-Bootstrap'>
          <Nav>
            <DropdownButton
              menuAlign={{ lg: 'left' }}
              title={
                <span><img src={require("../../../assets/img/thompson.jpg").default} /></span>
              }
            >
              <Dropdown.Item eventKey='0'><BsPeopleCircle/> User Profile</Dropdown.Item>
              <Dropdown.Item divider="true" />
              <Dropdown.Item eventKey='1' href="/login" onClick={logOut}><BsBoxArrowRight/> Logout</Dropdown.Item>
            </DropdownButton>
          </Nav>
        </Navbar>
        </div>
        
      </React.Fragment>
    );
  }


export default Info;
