import React, { useCallback, useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import UsersDataService from "../../services/users/users.service";
import { Table, Spinner, Modal, Button, Badge, FormControl, Form } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function UsersTable() {

  const initialUserState = {  
    id: null,  
    name: "",
    email: "",
  };

  const [user, setUser] = React.useState(initialUserState);
  const [submitted, setSubmitted] = React.useState(false);
  const [noData, setNoData] = React.useState('');
  const [users, setUsers] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  
  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
        handleInputChange(event); 
        updateUser();
    }
    setValidated(true);       
  };

  const handleClose = () =>{
    newUser();
    setShow(false);
    setValidated(false);
  };
  const handleShow = () => setShow(true);
  const handleCloseConfirm = () => setConfirm(false);
  const handleConfirm = () => setConfirm(true);
  const handleCloseInfo = () => {
    newUser();
    setInfo(false);
  };
  const handleInfo = () => setInfo(true);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  useEffect(()=>{
        retrieveUsers();
  }, []);
  const retrieveUsers = () => {
    UsersDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
        if(response.data.data.length !== 0){
          setUsers({...users, data: response.data.data});
        }else{
          setNoData("No data");
        }
          
        
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  const GetActionFormat = useCallback((row) =>{
    
    return (
        <div>
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setUser(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setUser(row); setShow(true)}}>
                <BsPen></BsPen>
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm"onClick={
              function(event){ setId(row.id); setConfirm(true)}}>
            <BsTrash></BsTrash>
            </button>
        </div>
    );
});

const deleteItemFromState = (id) => {
  console.log(id);
  const updatedItems = users.data.filter(x=>x.id!==id)
  setUsers({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'email',  
    text: 'Email',  
    sort: true  },   
    {
        text: 'Actions',
        dataField: 'Actions',
        editable: false 
     } 
];

const updateUser = () => {
  var data = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  console.log(data);
  UsersDataService.update(data.id, data)
    .then(response => {
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      });
      setSubmitted(true);
      console.log();
      handleClose();
      const updatedItems = users.data.filter(x=>x.id!==user.id)
      updatedItems.push(response.data.data);
      setUsers({...users, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteUser = (id) => {
  UsersDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newUser = () => {
  setUser(initialUserState);
  setSubmitted(false);
};


  return (
    <div>
      {users?(
      users.data.length===0 && noData===''?(        
        <div className="text-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ):(        
      <div className="container">  
      
      <>
 <Table striped bordered hover responsive="lg">
  <thead>
    <tr>
      {columns.map((field)=>
        <th>{field.text}</th>
      )}
    </tr>
  </thead>
  <tbody>

  {users.data.map((field)=>
        <tr>
        <td>{field.id}</td>
        <td>{field.name}</td>
        <td>{field.email}</td>
        <td>{GetActionFormat(field)}</td>
      </tr>
      )  
  }
  </tbody>
</Table>
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Drug info {user.id}</Modal.Title>
  </Modal.Header>
  <Form noValidate validated={validated} onSubmit={handleSubmit}> 
  <Modal.Body>  
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={user.name} onChange={handleInputChange} name="name"/>
    <Form.Control.Feedback type="invalid">
      Name is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder="" required value={user.email} onChange={handleInputChange} name="email"/>
    <Form.Control.Feedback type="invalid">
      Email is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {<Button  variant="primary" onClick={handleSubmit}>
            Update User
          </Button>}          
        </Modal.Footer>
        </Form>
      </Modal>

  <Modal show={confirm} onHide={handleCloseConfirm} id = {id}>
  <Modal.Header closeButton>
    <Modal.Title>User Delete {id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>deleteUser(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={info} onHide={handleCloseInfo}>
  <Modal.Header closeButton>
    <Modal.Title>User info {user.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={user.name} onChange={handleInputChange} disabled name="name"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Email</Form.Label>
    <Form.Control type="text" placeholder="" required  value={user.email} onChange={handleInputChange} disabled name="substance"/>
  </Form.Group>  
  
</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfo}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
</>
  </div>  )
    ):(<div>
      <br />
      <p>Please click on a Tutorial...</p>
    </div>)
      
    }</div>
    
    
  );
}