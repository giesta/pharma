import React, { useCallback, useEffect } from 'react';
import UsersDataService from "../../services/users/users.service";
import { Table, Spinner, Modal, Button, Form } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle} from "react-icons/bs";

export default function UsersTable() {

  const initialUserState = {  
    id: null,  
    name: "",
    email: "",
  };

  const [user, setUser] = React.useState(initialUserState);
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
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newUser();
    setInfo(false);
  };

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
        if(response.data.data.length !== 0){
          setUsers({...users, data: response.data.data});
        }       
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  const GetActionFormat = useCallback((row) =>{
    
    return (
      <td class="table-col">
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
        </td>
    );
});

const deleteItemFromState = (id) => {
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
  UsersDataService.update(data.id, data)
    .then(response => {
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      });
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
};


  return (
    <div>
      {users?(
      users.data.length===0?(        
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
        {GetActionFormat(field)}
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