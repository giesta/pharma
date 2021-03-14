import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';


export default function MainNavbar(props) {

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="https://www.youtube.com/watch?v=6B_6K-splRU">Code Of Universe</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">

    <Nav className="mr-auto">
    <Nav.Link href={"/"}>Home</Nav.Link>
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/drugs"}>Drugs</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/diseases"}>Diseases</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/treatments"}>Treatments</Nav.Link>)}
      {(props.showPharmacistBoard || props.showAdminBoard) && (<Nav.Link href={"/diagrams"}>Diagrams</Nav.Link>)}
      {props.showAdminBoard && (<Nav.Link href={"/users"}>Users</Nav.Link>)}
    </Nav>
    
    {props.currentUser ? (
      <Nav>
              <Nav.Link href={"/profile"}>{props.currentUser.user.name}</Nav.Link>
              <Nav.Link eventKey={2} href="/login" onClick={props.logOut}>
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
    );
}