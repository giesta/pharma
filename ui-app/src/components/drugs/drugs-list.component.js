import React, { useCallback, useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import DrugsDataService from "../../services/drugs/list.service";
import { Table, Spinner, Modal, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function DrugsTable() {

  const initialDrugState = {  
    id: null,  
    name: "",
    substance: "",
    indication: "",
    contraindication: "",
    reaction: "",
    use: ""
  };

  const [drug, setDrug] = React.useState(initialDrugState);
  const [submitted, setSubmitted] = React.useState(false);
  const [noData, setNoData] = React.useState('');

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  

  const handleClose = () =>{
    newDrug();
    setShow(false);
    
  };
  const handleShow = () => setShow(true);
  const handleCloseConfirm = () => setConfirm(false);
  const handleConfirm = () => setConfirm(true);
  const handleCloseInfo = () => {
    newDrug();
    setInfo(false);
  };
  const handleInfo = () => setInfo(true);
  const [drugs, setDrugs] = React.useState({
    data: [],
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setDrug({ ...drug, [name]: value });
  };
  useEffect(()=>{
        retrieveDrugs();
  }, []);
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data});
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
              function(event){ setDrug(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setDrug(row); setShow(true)}}>
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
  const updatedItems = drugs.data.filter(x=>x.id!==id)
  setDrugs({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'substance',  
    text: 'Substance',  
    sort: true  },  
  { dataField: 'indication',  
    text: 'Indication',  
    sort: true  },  
  { dataField: 'contraindication',  
text: 'Contraindication',  
    sort: true },  
  {  
    dataField: 'reaction',  
    text: 'Reaction',  
    sort: true  
  }, {  
    dataField: 'use',  
    text: 'Use',  
    sort: true },
 {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
 }
];

const saveDrug = () => {
  var data = {
    token: AuthService.getCurrentUser().access_token,
    name: drug.name,
    substance: drug.substance,
    indication: drug.indication,
    contraindication: drug.contraindication,
    reaction: drug.reaction,
    use: drug.use
  };
  console.log(data);
  DrugsDataService.create(data)
    .then(response => {
      setDrug({
        name: response.data.name,
        substance: response.data.substance,
        indication: response.data.indication,
        contraindication: response.data.contraindication,
        reaction: response.data.reaction,
        use: response.data.use
      });
      setSubmitted(true);
      console.log(response.data);
      handleClose();
      drugs.data.push(response.data.data);
      setDrugs({...drugs, data: drugs.data});
    })
    .catch(e => {
      console.log(e);
    });
};

const updateDrug = () => {
  var data = {
    id: drug.id,
    name: drug.name,
    substance: drug.substance,
    indication: drug.indication,
    contraindication: drug.contraindication,
    reaction: drug.reaction,
    use: drug.use
  };
  console.log(data);
  DrugsDataService.update(data.id, data)
    .then(response => {
      setDrug({
        id: response.data.id,
        name: response.data.name,
        substance: response.data.substance,
        indication: response.data.indication,
        contraindication: response.data.contraindication,
        reaction: response.data.reaction,
        use: response.data.use
      });
      setSubmitted(true);
      console.log(response.data);
      handleClose();
      const updatedItems = drugs.data.filter(x=>x.id!==drug.id)
      updatedItems.push(drug);
      setDrugs({...drugs, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteDrug = (id) => {
  DrugsDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newDrug = () => {
  setDrug(initialDrugState);
  setSubmitted(false);
};


  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {drugs?(
      drugs.data.length===0 && noData===''?(        
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

  {drugs.data.map((field)=>
        <tr>
        <td>{field.id}</td>
        <td>{field.name}</td>
        <td>{field.substance}</td>
        <td>{field.indication}</td>
        <td>{field.contraindication}</td>
        <td>{field.reaction}</td>
        <td>{field.use}</td>
        <td>{GetActionFormat(field)}</td>
      </tr>
      )  
  }
  </tbody>
</Table>
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Drug info {drug.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.name} onChange={handleInputChange} name="name"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Substance</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.substance} onChange={handleInputChange} name="substance"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Indication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.indication} onChange={handleInputChange} name="indication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Contraindication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.contraindication} onChange={handleInputChange} name="contraindication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Reaction</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.reaction} onChange={handleInputChange} name="reaction"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Use</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.use} onChange={handleInputChange} name="use"/>
  </Form.Group>
</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {drug.id===null?(<Button variant="primary" onClick={saveDrug}>
            Create Drug
          </Button>):(<Button variant="primary" onClick={updateDrug}>
            Update Drug
          </Button>)}
          
        </Modal.Footer>
      </Modal>

  <Modal show={confirm} onHide={handleCloseConfirm} id = {id}>
  <Modal.Header closeButton>
    <Modal.Title>Drug Delete {id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>deleteDrug(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={info} onHide={handleCloseInfo}>
  <Modal.Header closeButton>
    <Modal.Title>Drug info {drug.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.name} onChange={handleInputChange} disabled name="name"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Substance</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.substance} onChange={handleInputChange} disabled name="substance"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Indication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.indication} onChange={handleInputChange} disabled name="indication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Contraindication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.contraindication} onChange={handleInputChange} disabled name="contraindication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Reaction</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.reaction} onChange={handleInputChange} disabled name="reaction"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Use</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.use} onChange={handleInputChange} disabled name="use"/>
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