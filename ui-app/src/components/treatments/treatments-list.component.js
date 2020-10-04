import React, { useCallback, useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import TreatmentsDataService from "../../services/treatments/list.service";
import { Table, Spinner, Modal, Button, InputGroup, FormControl, Form, Image } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";
import ImageUploading from 'react-images-uploading';

export default function MaterialTableDemo() {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
  };

  const [treatment, setTreatment] = React.useState(initialTreatmentState);
  const [submitted, setSubmitted] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [url, setUrl] = React.useState(null);
  const maxNumber = 69;

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  

  const handleClose = () =>{
    newTreatment();
    setShow(false);
    
  };
  const handleShow = () => setShow(true);
  const handleCloseConfirm = () => setConfirm(false);
  const handleConfirm = () => setConfirm(true);
  const handleCloseInfo = () => {
    newTreatment();
    setInfo(false);
  };
  const handleInfo = () => setInfo(true);
  const [Treatments, setTreatments] = React.useState({
    data: [],
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    
    if(event.target.files!==undefined && event.target.files!==null ){
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
        setUrl(URL.createObjectURL(event.target.files[0]));
    }
    
    setTreatment({ ...treatment, [name]: value });
  };
  useEffect(()=>{
        retrieveTreatments();
  }, []);
  const retrieveTreatments = () => {
    TreatmentsDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
        if(response.data.data.length !== 0){
          setTreatments({...Treatments, data: response.data.data});
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
              function(event){ setTreatment(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setTreatment(row); setShow(true)}}>
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
  const updatedItems = Treatments.data.filter(x=>x.id!==id)
  setTreatments({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'title',  
    text: 'Title',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Description',  
    sort: true  },    
    {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
 }
];

const saveTreatment = () => {
    const data = new FormData();
    console.log(treatment.algorithm);
    data.append('Content-Type','multipart/formdata');
    if(selectedFile!==null){
        data.append("algorithm", selectedFile);        
    }    
    data.append("title", treatment.title);
    data.append("description", treatment.description);
    data.append("disease_id", 4);
  
  // Display the values
for (var value of data.values()) {
    console.log(value); 
 }
  TreatmentsDataService.create(data)
    .then(response => {
      setTreatment({
        title: response.data.title,
        description: response.data.description,
        algorithm: response.data.algorithm,
      });
      setSubmitted(true);
      setUrl(null);
      handleClose();
      Treatments.data.push(response.data.data);
      setTreatments({...Treatments, data: Treatments.data});
    })
    .catch(e => {
      console.log(e);
    });
};

const updateTreatment = () => {
  var data = {
    id: treatment.id,
    title: treatment.title,
    description: treatment.description,
    algorithm: treatment.algorithm,
  };
  console.log(data);
  TreatmentsDataService.update(data.id, data)
    .then(response => {
      setTreatment({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        algorithm: response.data.algorithm,
      });
      setSubmitted(true);
      console.log(response.data);
      handleClose();
      const updatedItems = Treatments.data.filter(x=>x.id!==treatment.id)
      updatedItems.push(treatment);
      setTreatments({...Treatments, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteTreatment = (id) => {
  TreatmentsDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newTreatment = () => {
  setTreatment(initialTreatmentState);
  setSubmitted(false);
};


  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {Treatments?(
      Treatments.data.length===0 && noData===''?(        
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

  {Treatments.data.map((field)=>
        <tr>
        <td>{field.id}</td>
        <td>{field.title}</td>
        <td>{field.description}</td>
        <td>{GetActionFormat(field)}</td>
      </tr>
      )  
  }
  </tbody>
</Table>
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Treatment info {treatment.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form encType="multipart/form-data">
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder="" required value={treatment.title} onChange={handleInputChange} name="title"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text" as="textarea" placeholder="" required value={treatment.description} onChange={handleInputChange} name="description"/>
  </Form.Group>
  <Form.Group >    
    <Form.File id="exampleFormControlFile1" label="Algorithm" onChange={handleInputChange} name="algorithm"/>
  </Form.Group> 
  {url===null?(<Image src={treatment.algorithm} fluid/>):(<Image src={url} fluid/>)} 
  
</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {treatment.id===null?(<Button variant="primary" onClick={saveTreatment}>
            Create Treatment
          </Button>):(<Button variant="primary" onClick={updateTreatment}>
            Update Treatment
          </Button>)}
          
        </Modal.Footer>
      </Modal>

  <Modal show={confirm} onHide={handleCloseConfirm} id = {id}>
  <Modal.Header closeButton>
    <Modal.Title>Treatment Delete {id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>deleteTreatment(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={info} onHide={handleCloseInfo}>
  <Modal.Header closeButton>
    <Modal.Title>Treatment info {treatment.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder="" required value={treatment.title} onChange={handleInputChange} disabled name="title"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text" as="textarea" placeholder="" required value={treatment.description} onChange={handleInputChange} disabled name="description"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Algorithm</Form.Label>
    <Form.Control type="text" placeholder="" required value={treatment.algorithm} onChange={handleInputChange} disabled name="algorithm"/>
  </Form.Group>  
  <Image src={treatment.algorithm} fluid/>
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