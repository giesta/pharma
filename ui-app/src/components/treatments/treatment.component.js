import React, { useCallback, useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DrugsDataService from "../../services/diseases/disease.drug.service";
import Spinner from "../layout/spinner.component";
import { Col, Row, Modal, Button, Jumbotron, Container, Badge, Image, ListGroup, Card, Form } from "react-bootstrap";

export default function Treatment(props) {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    disease: null
  };
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

  const [currentTreatment, setCurrentTreatment] = React.useState(initialTreatmentState);
  const [currentDrugs, setCurrentDrugs] = React.useState([]);
  const [drug, setDrug] = React.useState(initialDrugState);
  const [show, setShow] = React.useState(false);
  const [noData, setNoData] = React.useState('');
 
  const handleClose = () =>{
    newDrug();
    setShow(false);
  };
  const newDrug = () => {
    setDrug(initialDrugState);
  };
  useEffect(()=>{    
        getTreatment(props.match.params.id);
  }, [props.match.params.id]);
  const getTreatment = useCallback((id)=> {
    TreatmentsDataService.getPublic(id)
      .then(response => {
        if (response.data.data.length !== 0) {
          setCurrentTreatment(response.data.data);
          getDrugs(response.data.data.disease.id);
        }else{
          setNoData('No');
        }
      })
      .catch(e => {
        console.log(e);
      });
  });
  
  const getDrugs = (id) => {
    DrugsDataService.getPublic(id)
      .then(response => {    
        if(response.data.data.length !== 0){
          setCurrentDrugs(...currentDrugs, response.data.data);
        }      
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div>
      {currentTreatment?(
      currentTreatment.disease === null && noData === ''?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">     
      <>
      <Row>
        <Col md={{ span: 6, offset: 3 }}><Image src={currentTreatment.algorithm} fluid/></Col>        
      </Row>
      <Row>
        <Col className="mt-1" md={{ span: 6, offset: 3 }}>
         <Jumbotron fluid>
          <Container>
            <h1>{currentTreatment.title}</h1>
            <p>
              {currentTreatment.description}
            </p>
          </Container>
         </Jumbotron>
          </Col>        
        </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
         <ListGroup className="mt-1">
         <ListGroup.Item variant="light">Drugs</ListGroup.Item>
          {currentDrugs.drugs!==undefined&&currentDrugs.drugs.map((field)=>
         <ListGroup.Item key={field.id} action onClick={function(event){ setDrug(field); setShow(true)}}>{field.name}</ListGroup.Item>
          )}
          </ListGroup>
        </Col>   
        <Col md="auto">
          {currentTreatment.disease!==null&&(
        <Card border="light" className="mt-1" style={{ width: '18rem' }}>
          <Card.Body>
          <Card.Title>Disease</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{currentTreatment.disease.name}</Card.Subtitle>
          <Card.Text>
              <label>
                <strong>Description:</strong>
              </label>{" "}
                {currentTreatment.disease.description}
              <label>
                <strong>Symptoms:</strong>
              </label>{" "}
              <Badge variant="secondary">{currentTreatment.disease.symptoms}</Badge>
          </Card.Text>
          </Card.Body>
        </Card>)}
        </Col>
      </Row>
      
  <Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Drug info {drug.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text"  value={drug.name} disabled name="name"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Substance</Form.Label>
    <Form.Control type="text" value={drug.substance} disabled name="substance"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Indication</Form.Label>
    <Form.Control type="text" value={drug.indication} disabled name="indication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Contraindication</Form.Label>
    <Form.Control type="text" value={drug.contraindication} disabled name="contraindication"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Adverse effect</Form.Label>
    <Form.Control type="text" value={drug.reaction} disabled name="reaction"/>
  </Form.Group>
  <Form.Group controlId="exampleForm.ControlInput1">
    <Form.Label>Use</Form.Label>
    <Form.Control type="text" value={drug.use} disabled name="use"/>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

  
</>
  </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>
    
    
  );
}