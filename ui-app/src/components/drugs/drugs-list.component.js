import React, { useCallback, useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import DrugsDataService from "../../services/drugs/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import { Table, Spinner, Modal, Button, Badge, FormControl, Form } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function DrugsTable() {

  const initialDrugState = {  
    id: null,  
    name: "",
    substance: "",
    indication: "",
    contraindication: "",
    reaction: "",
    use: "",
    diseases: []
  };

  const [drug, setDrug] = React.useState(initialDrugState);
  const [submitted, setSubmitted] = React.useState(false);
  const [noData, setNoData] = React.useState('');
  const [diseases, setDiseases] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [selectedDiseases, setSelectedDiseases] = React.useState([]);
  
  const [validated, setValidated] = React.useState(false);

  const AddSelectedDiseases = event => {
    const selectedDiseases = [...event.target.selectedOptions].map(o => o.value)
    setSelectedDiseases(selectedDiseases);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
      if(drug.id===null){
        saveDrug();
      }else{
        handleInputChange(event); 
        updateDrug();
      } 
    }
    setValidated(true);       
  };

  const handleClose = () =>{
    newDrug();
    setShow(false);
    setValidated(false);
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
          retrieveDiseases();
        }else{
          setNoData("No data");
        }       
      })
      .catch(e => {
        console.log(e);
      });
  };
  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
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
    use: drug.use,
    diseases: JSON.stringify(selectedDiseases)
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
        use: response.data.use,
        diseases: response.data.diseases,
      });
      
      console.log(response.data);
      setSubmitted(true);
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
    use: drug.use,
    diseases: JSON.stringify(selectedDiseases)
  };
  console.log(data);
  DrugsDataService.update(data.id, data)
    .then(response => {
      setDrug({
        id: response.data.data.id,
        name: response.data.data.name,
        substance: response.data.data.substance,
        indication: response.data.data.indication,
        contraindication: response.data.data.contraindication,
        reaction: response.data.data.reaction,
        use: response.data.data.use,
        diseases: response.data.data.diseases,
      });
      setSubmitted(true);
      console.log();
      handleClose();
      const updatedItems = drugs.data.filter(x=>x.id!==drug.id)
      updatedItems.push(response.data.data);
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
  <Form noValidate validated={validated} onSubmit={handleSubmit}> 
  <Modal.Body>  
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.name} onChange={handleInputChange} name="name"/>
    <Form.Control.Feedback type="invalid">
      Name is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Substance</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.substance} onChange={handleInputChange} name="substance"/>
    <Form.Control.Feedback type="invalid">
      Substance is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Indication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.indication} onChange={handleInputChange} name="indication"/>
    <Form.Control.Feedback type="invalid">
      Indication is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Contraindication</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.contraindication} onChange={handleInputChange} name="contraindication"/>
    <Form.Control.Feedback type="invalid">
      Contraindication is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Adverse effect</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.reaction} onChange={handleInputChange} name="reaction"/>
    <Form.Control.Feedback type="invalid">
      Adverse effect is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Use</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.use} onChange={handleInputChange} name="use"/>
    <Form.Control.Feedback type="invalid">
      Use is a required field.
    </Form.Control.Feedback>
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>
  {(drug.diseases!==null&&drug.diseases!==undefined)?(
      <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label>Diseases</Form.Label>     
    <Form.Control as="select" multiple defaultValue={drug.diseases.map(item=>item.id)} onChange={AddSelectedDiseases} name="diseases_id"> 
    {diseases.data.map((x)=>
        <option value={x.id}>{x.name}</option>
      )  
  }
  </Form.Control>  
  </Form.Group>
    ):(
      
    <Form.Group controlId="exampleForm.ControlSelect1"> 
    <Form.Label>Diseases</Form.Label>
  <Form.Control as="select" multiple onChange={AddSelectedDiseases} name="diseases_id">   
  {diseases.data.map((x)=>
      <option value={x.id}>{x.name}</option>
    )  
}
</Form.Control>
</Form.Group>)} 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {drug.id===null?(<Button  variant="primary" onClick={handleSubmit}>
            Create Drug
          </Button>):(<Button  variant="primary" onClick={handleSubmit}>
            Update Drug
          </Button>)}          
        </Modal.Footer>
        </Form>
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
    <Form.Label>Adverse effect</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.reaction} onChange={handleInputChange} disabled name="reaction"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Use</Form.Label>
    <Form.Control type="text" placeholder="" required value={drug.use} onChange={handleInputChange} disabled name="use"/>
  </Form.Group>
  {drug.diseases!==null && drug.diseases!==undefined?(<Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Diseases</Form.Label>
  {drug.diseases.map((x)=>
      <Badge pill variant="dark">
      {x.name}
    </Badge>
    )  
} </Form.Group>):('')}
  
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