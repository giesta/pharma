import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import AuthService from "../../../services/auth.service";
import { useHistory } from "react-router-dom";

function  Info(props) {
  let history = useHistory(); 
  const user = AuthService.getCurrentUser();
    return (
      <React.Fragment>
        <div>          
          <Navbar brand='React-Bootstrap'bg="dark" variant="dark">
          <Nav>
              <Nav.Link href={"/admin"}>{user.name}</Nav.Link>
              <Nav.Link eventKey={2} onClick={()=>{props.logOut(); history.push("/login")}}>
              Atsijungti
      </Nav.Link>
      </Nav>
          
        </Navbar>
        </div>
        
      </React.Fragment>
    );
  }


export default Info;
