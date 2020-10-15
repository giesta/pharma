import React, { useCallback, useEffect } from 'react';
import diseasesDataService from "../../services/diseases/list.service";
import { Table, Spinner, Modal, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function DiseasesTable() {

  const initialDiseaseState = {  
    id: null,  
    name: "",
    description: "",
    symptoms: "",
  };

  const [disease, setDisease] = React.useState(initialDiseaseState);
  const [submitted, setSubmitted] = React.useState(false);
  const [noData, setNoData] = React.useState('');

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
      if(disease.id===null){
        saveDisease();
      }else{
        handleInputChange(event); 
        updateDisease();
      } 
    }

    setValidated(true);
       
  };


  const handleClose = () =>{
    newDisease();
    setShow(false);
    
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newDisease();
    setInfo(false);
  };
  const handleInfo = () => setInfo(true);
  const [diseases, setDiseases] = React.useState({
    data: [],
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setDisease({ ...disease, [name]: value });
  };
  useEffect(()=>{
        retrieveDiseases();
  }, []);
  const retrieveDiseases = () => {
    diseasesDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
        if(response.data.data.length !== 0){
          setDiseases({...diseases, data: response.data.data});
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
              function(event){ setDisease(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setShow(true)}}>
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
  const updatedItems = diseases.data.filter(x=>x.id!==id)
  setDiseases({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Description',  
    sort: true  },  
  { dataField: 'symptoms',  
    text: 'Symptoms',  
    sort: true  },  
  {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
    }
  
];

const saveDisease = () => {
  var data = {
    name: disease.name,
    description: disease.description,
    symptoms: disease.symptoms
  };
  console.log(data);
  diseasesDataService.create(data)
    .then(response => {
      setDisease({
        name: response.data.name,
        description: response.data.description,
        symptoms: response.data.symptoms,
      });
      setSubmitted(true);
      console.log(response.data);
      handleClose();
      diseases.data.push(response.data.data);
      setDiseases({...diseases, data: diseases.data});
    })
    .catch(e => {
      console.log(e);
    });
};

const updateDisease = () => {
  var data = {
    id: disease.id,
    name: disease.name,
    description: disease.description,
    symptoms: disease.symptoms,
  };
  console.log(data);
  diseasesDataService.update(data.id, data)
    .then(response => {
      setDisease({
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        symptoms: response.data.symptoms,
      });
      setSubmitted(true);
      console.log(response.data);
      handleClose();
      const updatedItems = diseases.data.filter(x=>x.id!==disease.id)
      updatedItems.push(disease);
      setDiseases({...diseases, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteDisease = (id) => {
  diseasesDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newDisease = () => {
  setDisease(initialDiseaseState);
  setSubmitted(false);
};


  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {diseases?(
      diseases.data.length===0 && noData===''?(        
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

  {diseases.data.map((field)=>
        <tr>
        <td>{field.id}</td>
        <td>{field.name}</td>
        <td>{field.description}</td>
        <td>{field.symptoms}</td>
        <td>{GetActionFormat(field)}</td>
      </tr>
      )  
  }
  </tbody>
</Table>
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Disease info {disease.id}</Modal.Title>
  </Modal.Header>
  <Form noValidate validated={validated} onSubmit={handleSubmit}>
  <Modal.Body>
  
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={disease.name} onChange={handleInputChange} name="name"/>
    <Form.Control.Feedback type="invalid">
      Name is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text"  as="textarea" placeholder="" required value={disease.description} onChange={handleInputChange} name="description"/>
    <Form.Control.Feedback type="invalid">
      Description is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Symptoms</Form.Label>
    <Form.Control type="text" placeholder="" required value={disease.symptoms} onChange={handleInputChange} name="symptoms"/>
    <Form.Control.Feedback type="invalid">
      Symptoms is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>  

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {disease.id===null?(<Button type = "submit" variant="primary">
            Create Disease
          </Button>):(<Button type = "submit" variant="primary">
            Update Disease
          </Button>)}          
        </Modal.Footer>
        </Form>
      </Modal>

  <Modal show={confirm} onHide={handleCloseConfirm} id = {id}>
  <Modal.Header closeButton>
    <Modal.Title>Disease Delete {id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>deleteDisease(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={info} onHide={handleCloseInfo}>
  <Modal.Header closeButton>
    <Modal.Title>Disease info {disease.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={disease.name} onChange={handleInputChange} disabled name="name"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text" as="textarea" placeholder="" required value={disease.description} onChange={handleInputChange} disabled name="description"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Symptoms</Form.Label>
    <Form.Control type="text" placeholder="" required value={disease.symptoms} onChange={handleInputChange} disabled name="symptoms"/>
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