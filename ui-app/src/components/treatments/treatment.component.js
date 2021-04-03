import React, { useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import StarService from "../../services/treatments/stars.service";
import ReportService from "../../services/treatments/reports.service";
import CommentService from "../../services/treatments/comments.service";
import DrugsDataService from "../../services/diseases/disease.drug.service";
import DateParser from "../../services/parseDate.service";
import AuthService from "../../services/auth.service";
import Spinner from "../layout/spinner.component";
import DrugInfo from "../drugs/info-modal.component";
import { Col, Row, Button, Jumbotron, Container, Badge, Image, ListGroup, Card, Form} from "react-bootstrap";
import { BsStar, BsPeopleCircle, BsExclamationCircle } from "react-icons/bs";

export default function Treatment(props) {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    isStar:true,
    isReported:true,
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
  const [comment, setComment] = React.useState('');
  const [validated, setValidated] = React.useState(false);
  const [userData] = React.useState(AuthService.getCurrentUser());

  const onChangeComment = e => {
    const comment = e.target.value;
    setComment(comment);
  };
 
  const handleClose = () =>{
    newDrug();
    setShow(false);
  };
  const newDrug = () => {
    setDrug(initialDrugState);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.stopPropagation();
      setValidated(true);
    }else{
      tweet();
      setValidated(false);
    }
           
  };
  
  useEffect(()=>{ 

    const getDrugs = (id) => {
      DrugsDataService.getPublic(id)
        .then(response => {    
          if(response.data.data.length !== 0){
            console.log(response.data.data);
            setCurrentDrugs(response.data.data);
          }      
        })
        .catch(e => {
          console.log(e);
        });
    };

    const getTreatment = (id)=> {
      var get;
      if(AuthService.getCurrentUser()===null){
        get = TreatmentsDataService.getPublic(id);
      }else{
        get = TreatmentsDataService.get(id);
      }
      get
        .then(response => {
          
          if (response.data.data.length !== 0) {
            console.log(response.data.data);
            setCurrentTreatment(response.data.data);
            getDrugs(response.data.data.disease.id);
          }else{
            setNoData('No');
          }
        })
        .catch(e => {
          console.log(e);
        });
    };
    getTreatment(props.match.params.id);

  }, [props.match.params.id]);

  
  const star = () => {
    var data = {
      id: AuthService.getCurrentUser().id
    };
    StarService.update(currentTreatment.id, data)
      .then(response => {    
        if(response.data.data.length !== 0){
          setCurrentTreatment(response.data.data);
        }      
      })
      .catch(e => {
        console.log(e);
      });
  };
  const report = () => {
    var data = {
      id: AuthService.getCurrentUser().id
    };
    ReportService.update(currentTreatment.id, data)
      .then(response => {    
        if(response.data.data.length !== 0){
          setCurrentTreatment(response.data.data);
        }      
      })
      .catch(e => {
        console.log(e);
      });
  };
  const tweet=()=>{
    var data = {
      content: comment,
      user_id: userData.user.id,      
      treatment_id: currentTreatment.id,
    };
    CommentService.create(data).then(response=>{
      setCurrentTreatment(response.data.data);
      setComment("");
    }).catch(e => {
      console.log(e);
    });
  }

  function getDrugsSubstances(field){    
  
    const arr =field.drugs.map(x =>x.substance);
    const result = [];
    const map = new Map();
    for (const item of arr) {
        if(!map.has(item)){
            map.set(item, true); 
            //console.log(drugs);   // set any value to Map
            result.push(item);
        }
}
    console.log(result);
    return result;
  };
  
  return (
    <div>
      {console.log(currentTreatment)}
      {currentTreatment?(
      currentTreatment.disease === null && noData === ''?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">
      <Row>
        <Col>
          <Button variant="secondary" size="sm" disabled={currentTreatment.isStar} onClick={star}>
            <BsStar></BsStar>{' '}<Badge variant="light">{currentTreatment.stars}</Badge>
          </Button>
        </Col>
        <Col>
          <Button className="float-right" variant="outline-secondary" size="sm" disabled={currentTreatment.isReported} onClick={report}>Report {" "}
            <BsExclamationCircle></BsExclamationCircle>
          </Button>
        </Col>        
    </Row>
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
          {currentTreatment.drugs!==undefined&&currentTreatment.drugs.map((field)=>
         <ListGroup.Item key={field.id} action onClick={function(event){ setDrug(field); setShow(true)}}>{field.substance.name}</ListGroup.Item>
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
              </label>{" "}{console.log(currentTreatment.disease.symptoms)}
              
              
              {currentTreatment.disease.symptoms.map(item=><Badge variant="secondary">{item.name}</Badge>)}
          </Card.Text>
          </Card.Body>
        </Card>)}
        </Col>
      </Row>
      <div className="container">
      {userData!==null?(
      <Row>
        <Col></Col>
        <Col className="col-6">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="Comment">
            <Form.Label>Comments</Form.Label>
            <Form.Control className="border border-secondary rounded" as="textarea" required rows={3} placeholder="Leave a comment" value = {comment} onChange={onChangeComment}/>
          </Form.Group>
          <Button type="submit" variant="secondary" className="mb-2">
            Comment
          </Button>
        </Form>
        
        </Col>
        <Col></Col>
        </Row>):('')}
        <Row>
        <Col></Col>
        <Col className="col-6">
            <ListGroup variant="flush">
              {currentTreatment.comments.map((field)=>
                <ListGroup.Item key={field.id}>
                <Row>
                  <div className="mr-4">
                    <BsPeopleCircle></BsPeopleCircle>
                  </div>
                  <div className="w-75">
                    <Row>
                      <Col className="col-md-auto"><h5>{field.name+" "}</h5></Col>
                      <Col><h6>{ DateParser.getParsedDate(field.created_at)}</h6></Col>
                    </Row>                    
                    <p>{field.content}</p>
                  </div>
                </Row>
              </ListGroup.Item>
              )}            
          </ListGroup> 
        </Col>
        <Col></Col>
        </Row>

      </div>
{ show &&<DrugInfo info = {show} leaflet = {drug} handleCloseInfo={handleClose}></DrugInfo> } 
  </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)      
    }</div>    
  );
}