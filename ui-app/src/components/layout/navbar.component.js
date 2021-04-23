import React from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../logo.svg';


export default function MainNavbar(props) {
  let history = useHistory();

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="/home"><img className="brand" src={logo}></img>{' '}
    PharmaH2O</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">

    <Nav className="mr-auto">
    {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/home"}>Pagrindinis</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/drugs"}>Vaistai</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/diseases"}>Ligos</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/treatments"}>Algoritmai</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/diagrams"}>Diagramos</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/interactions"}>Sąveikos</Nav.Link>)}
      {props.showAdminBoard && (<Nav.Link href={"/users"}>Users</Nav.Link>)}
    </Nav>
    
    {props.currentUser ? (
      <Nav>
              <Nav.Link href={"/profile"}>{props.currentUser.name}</Nav.Link>
              <Nav.Link eventKey={2} onClick={()=>{props.logOut(); history.push("/login")}}>
              Atsijungti
      </Nav.Link>
      </Nav>
          ) : (
<Nav>
              <Nav.Link href={"/login"}>Prisijungti</Nav.Link>
              <Nav.Link eventKey={2} href={"/register"}>
              Užsiregistruoti
      </Nav.Link>
      </Nav>            
          )}
    
  </Navbar.Collapse>
</Navbar> 
    );
}