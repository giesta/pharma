import React, { useCallback, useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import { Table, Spinner, Modal, Button, InputGroup, FormControl, Form, Image } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function MaterialTableDemo() {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    disease: null
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
  const [Diseases, setDiseases] = React.useState({
    data: [],
  });
  const handleInputChange = event => {
    const { name, value } = event.target;
    
    if(event.target.files!==undefined && event.target.files!==null ){
      //console.log("Yra");
        setSelectedFile(event.target.files[0]);
        //console.log(event.target.files[0]);
        setUrl(URL.createObjectURL(event.target.files[0]));
    }
    
    setTreatment({ ...treatment, [name]: value });
  };
  useEffect(()=>{
        retrieveTreatments();
        retrieveDiseases();
  }, []);
  const retrieveTreatments = () => {
    TreatmentsDataService.getAll()
      .then(response => {   
        //console.log(response.data.data)     
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

  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setDiseases({...Diseases, data: response.data.data});
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
    sort: true  }, {  
    dataField: 'disease',  
    text: 'Disease',  
    sort: true  },   
    {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
 }
];

const saveTreatment = () => {
    const data = new FormData();
    data.append('Content-Type','multipart/formdata');
    if(selectedFile!==null){
        data.append("algorithm", selectedFile);        
    } 
    data.append("title", treatment.title);
    data.append("description", treatment.description);
    data.append("disease_id", treatment.disease_id);
TreatmentsDataService.create(data)
    .then(response => {
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        disease: response.data.data.disease
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
  const data = new FormData();
  data.append('Content-Type','multipart/formdata');
  data.append('_method', 'PUT');
  console.log(treatment);
  if(selectedFile!==null){
      data.append("algorithm", selectedFile);        
  } 
  data.set("title", treatment.title);
  data.set("description", treatment.description);
  data.set("disease_id", treatment.disease_id);
  TreatmentsDataService.update(treatment.id, data)
    .then(response => {
      console.log(response.data)
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        disease: response.data.data.disease
      });
      setSubmitted(true);
      setUrl(null);
      handleClose();
      const updatedItems = Treatments.data.filter(x=>x.id!==treatment.id)
      updatedItems.push(response.data.data);
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
        <td>{field.disease.name}</td>
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
  
    {treatment.disease!==null?(
      <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label>Disease</Form.Label>
    <Form.Control as="select"defaultValue={treatment.disease.id} onChange={handleInputChange} name="disease_id"> 
    {Diseases.data.map((x)=>
        <option value={x.id}>{x.name}</option>
      )  
  }
  </Form.Control>
  </Form.Group>
    ):(<Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Disease</Form.Label>
  <Form.Control as="select" onChange={handleInputChange} name="disease_id"> 
  {Diseases.data.map((x)=>
      <option value={x.id}>{x.name}</option>
    )  
}
</Form.Control>
</Form.Group>)}  
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
    <Form.Control type="text" placeholder="" value={treatment.title} onChange={handleInputChange} disabled name="title"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Description</Form.Label>
    <Form.Control type="text" as="textarea" placeholder="" value={treatment.description} onChange={handleInputChange} disabled name="description"/>
  </Form.Group>
  {
    treatment.disease!== null?(<Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Disease</Form.Label>
    <Form.Control type="text" placeholder="" value={treatment.disease.name} onChange={handleInputChange} disabled name="algorithm"/>
  </Form.Group>):(<Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Disease</Form.Label>
    <Form.Control type="text" placeholder="" onChange={handleInputChange} disabled name="algorithm"/>
  </Form.Group>)
  }
  
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Algorithm</Form.Label>
    <Form.Control type="text" placeholder="" value={treatment.algorithm} onChange={handleInputChange} disabled name="algorithm"/>
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