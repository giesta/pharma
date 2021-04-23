import React from "react";
import { Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsBoxArrowRight, BsPeopleCircle } from "react-icons/bs";
import AuthService from "../../../services/auth.service";
import { useHistory } from "react-router-dom";

function  Info(props) {
  let history = useHistory(); 
  const user = AuthService.getCurrentUser();
    return (
      <React.Fragment>
        <div className="name-user">{user.name}</div>
        <div className="avatar-user">          
          <Navbar brand='React-Bootstrap'>
          <Nav>
            <DropdownButton
            variant="dark"
              menuAlign={{ lg: 'left' }}
              title={
                <span><img src={require("../../../assets/img/thompson.jpg").default} /></span>
              }
            >
              <Dropdown.Item eventKey='0'><BsPeopleCircle/> Naudotojo profilis</Dropdown.Item>
              <Dropdown.Item divider="true" />
              <Dropdown.Item eventKey='1' onClick={()=>{props.logOut(); history.push("/login")}}><BsBoxArrowRight/> Atsijungti</Dropdown.Item>
            </DropdownButton>
          </Nav>
        </Navbar>
        </div>
        
      </React.Fragment>
    );
  }


export default Info;
