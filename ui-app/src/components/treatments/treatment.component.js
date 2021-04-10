import React, { useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import StarService from "../../services/treatments/stars.service";
import ReportService from "../../services/treatments/reports.service";
import CommentService from "../../services/treatments/comments.service";
import DrugsDataService from "../../services/diseases/disease.drug.service";
import DiseaseOverviewsDataService from "../../services/diseases/overviews.service";
import DiagramsDataService from "../../services/diagrams/list.service";
import DateParser from "../../services/parseDate.service";
import NestedList from "./nested-list.component";
import DiagramInfo from "../diagrams/info-modal.component";
import AuthService from "../../services/auth.service";
import Spinner from "../layout/spinner.component";
import DrugInfo from "../drugs/info-modal.component";
import DownloadTreatment from "./download-modal.component";
import { Col, Row, Button, Jumbotron, Container, Badge, Image, ListGroup, Card, Form} from "react-bootstrap";
import { BsStar, BsPeopleCircle, BsExclamationCircle, BsInfoCircle, BsCloudDownload } from "react-icons/bs";
import fetchNodes from "./fetchNodes";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
} from 'react-flow-renderer'; 
const nodes = fetchNodes();
export default function Treatment(props) {

  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView({ padding: 0.8, includeHiddenNodes: true });
  };

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
    uses: "",
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
  const [showDiagram, setShowDiagram] = React.useState(false);
  const [elements, setElements] = React.useState([]);
  const [confirm, setConfirm] = React.useState(false);
  const [confirmToOverwrite, setConfirmToOverwrite] = React.useState(false);
  const [identifier, setIdentifier] = React.useState(null);
  const [diagramId, setDiagramId] = React.useState(null);

  const onChangeComment = e => {
    const comment = e.target.value;
    setComment(comment);
  };
 
  const handleClose = () =>{
    newDrug();
    setShow(false);
  };

  const handleCloseConfirm = () => {
    console.log(confirm);
    console.log(confirmToOverwrite);
    setConfirm(false);
    console.log(confirm);
    console.log(confirmToOverwrite);
  };
  const handleCloseConfirmToOverwrite = () => {
    setConfirmToOverwrite(false);
    setIdentifier(null);
  };

  const handleCloseInfo = () => {
    setShowDiagram(false);
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
      user_id: userData.id,      
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
        if(!map.has(item.name)){
            map.set(item.name, true);
            const map1 = new Map();
            var temp = [];
            temp = field.drugs.filter(x =>x.substance.name===item.name);
            var t1 = [];
            for (const item2 of temp) {
              if(!map1.has(item2.form)){
                  map1.set(item2.form, true);
                  const map2 = new Map();
                  var t2 = [];
                  var temp2 = [];
                  temp2 = field.drugs.filter(x =>x.substance.name===item.name&&x.form===item2.form);
                for (const item3 of temp2) {
                  if(!map2.has(item.strength)){
                      map2.set(item.strength, true);
                      
                      var array = field.drugs.filter(x =>x.substance.name===item.name&&x.form===item2.form&&x.strength===item3.strength);
                      t2.push({label:item3.strength, children:array.map((item)=>{                        
                        return {label:item.name, drug:item}
                      })});//drugs
                  }
                }

                  t1.push({label:item2.form, children:t2});//form
              }
            }
            //console.log(drugs);   // set any value to Map
            result.push({label:item.name, children:t1});//substance
        }
}
    return result;
  };
  

  function getElements(diagram){
    var arr = diagram.nodes.concat(diagram.edges);
    var items = arr.map((el)=>{
      if(el.source === undefined){
        var item = {id:el.item_id, data:{label:el.label, style:{backgroundColor:el.background}}, style:{backgroundColor:el.background}, type:el.type, position:{x:parseInt(el.x), y:parseInt(el.y)}};
        return item;
      }else{
        var item = {id:el.item_id, data:{label:el.label, style:{stroke:el.stroke}, animated:el.animated===1?true:false}, animated:el.animated===1?true:false, arrowHeadType:el.arrow, label:el.label, style:{stroke:el.stroke}, type:el.type, source:el.source, target:el.target};
        return item;
      }
      
  });
  //setElements(items);
return items;
}

const downloadItem = () => {
  
  console.log(currentTreatment.disease.name);
  DiseaseOverviewsDataService.findByTitle(1, currentTreatment.disease.name)
      .then(response => {
          //console.log(response.data);
          if(response.data.data.length > 0){
            //console.log(response.data.data);
            console.log(response.data.data[0])
            setIdentifier(response.data.data[0].id);
            
            handleCloseConfirm();
            setConfirmToOverwrite(true);
          }else{
            handleCloseConfirm();
            createDisease();
          }
          
      })
};

const updateDisease = () => {
  console.log(currentTreatment.disease.drugs);
  var drugsArr = currentTreatment.disease.drugs.map(item=>{
    return {selected:[item], uses:item.uses}
  });
  console.log(drugsArr);
  var data = {
    id: identifier,
    disease_id: currentTreatment.disease.disease_id,
    description: currentTreatment.disease.description,
    diagnosis: currentTreatment.disease.diagnosis,
    prevention: currentTreatment.disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(currentTreatment.disease.symptoms.map(item=>item.id)),
  };console.log(data);
  DiseaseOverviewsDataService.update(data.id, data)
    .then((resp) => {  
      console.log(resp);
      saveDiagram();
      //saveTreatment();
      /*const updatedItems = overviews.filter(x=>x.id!==disease.id)
      updatedItems.push(resp.data.data);
      setOverviews(updatedItems);
      handleClose();*/
    })
    .catch(e => {
      //setError(true);
      console.log(e);
    });
};
const createDisease = () => {
  console.log(currentTreatment.disease.drugs);
  var drugsArr = currentTreatment.disease.drugs.map(item=>{
    return {selected:[item], uses:item.uses}
  });
  console.log(drugsArr);
  var data = {
    disease_id: currentTreatment.disease.disease_id,
    description: currentTreatment.disease.description,
    diagnosis: currentTreatment.disease.diagnosis,
    prevention: currentTreatment.disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(currentTreatment.disease.symptoms.map(item=>item.id)),
  };console.log(data);
  DiseaseOverviewsDataService.create(data)
    .then((resp) => {  
      console.log(resp.data.data.id);
      
      setIdentifier(resp.data.data.id);
      saveDiagram(resp.data.data.id);
      
      
      /*const updatedItems = overviews.filter(x=>x.id!==disease.id)
      updatedItems.push(resp.data.data);
      setOverviews(updatedItems);
      handleClose();*/
    })
    .catch(e => {
      //setError(true);
      console.log(e);
    });
};

const saveTreatment = (diagramId, overviewId) => {
  var drugsArr = currentTreatment.drugs;
  var newArr = [];
newArr = [].concat(...drugsArr);
drugsArr = newArr.map(item=>item.id);
var data = {
    treatment_id:currentTreatment.id,
    algorithm:currentTreatment.algorithm,
    title:currentTreatment.title,
    description:currentTreatment.description,
    overview_id:overviewId<0?identifier:overviewId,
    public: 0,
    uses:currentTreatment.uses,
    drugs:JSON.stringify(drugsArr),
    diagram_id: diagramId,
};
    console.log(data);
TreatmentsDataService.create(data)
    .then((response) => {
      console.log(response.data.data);
      handleClose();
      props.history.push("/treatments");
      //props.history.push("/treatments");
      /*setFields([]);
      refreshList();
      setUrl(null);
      handleClose();*/
    })
    .catch(e => {
      //setError(true);
      console.log(e);
    });
};

const saveDiagram = (overviewId=-1) => {
  //console.log();
  //setElements(getElements(currentTreatment.diagram));
  console.log(elements);
var newElements = elements.map((el)=>{
    const {id: item_id, ...rest} = el;
    return {item_id, ...rest};
});
  var data = {
    name: currentTreatment.diagram.name,
    nodes: JSON.stringify(newElements.filter((el)=>{
      if(el.source === undefined){
        return el;
      }
    })),
    edges: JSON.stringify(newElements.filter((el)=>{
      if(el.source !== undefined){
        return el;
      }
    })),
  };
  console.log(data);
  DiagramsDataService.create(data)
    .then((response) => {
      console.log(response.data.data.id);
      setDiagramId(response.data.data.id)
      saveTreatment(response.data.data.id, overviewId);
    })
    .catch(e => {
      //setError(true);
      console.log(e);
    });
    console.log("-----Veikia saugojimas-----");
    console.log(elements);
    
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
          </Button>{' '}
          <Button variant="outline-info" size="sm" onClick={()=>{setElements(getElements(currentTreatment.diagram));setConfirm(true);}}> <BsCloudDownload/>{' '}
          </Button>
        </Col>
        <Col>
          <Button className="float-right" variant="outline-secondary" size="sm" disabled={currentTreatment.isReported} onClick={report}>Report {" "}
            <BsExclamationCircle></BsExclamationCircle>
          </Button>
        </Col>        
    </Row>
      <Row>
        <Col md={{ span: 6, offset: 3 }}><a target="_blank" href={currentTreatment.algorithm}><Image src={currentTreatment.algorithm} fluid/></a></Col>        
      </Row>
      {currentTreatment.diagram!==null?(
        <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className=" mt-2">
            <h6>Diagram: "{currentTreatment.diagram.name}" <Button variant="outline-info" size="sm" onClick={() =>{setElements(getElements(currentTreatment.diagram));setShowDiagram(true)} }>
            <BsInfoCircle/>{' '}
          </Button></h6>
          
          </div>
             
        <div className=" mt-2 mb-2 border">   
              
                <ReactFlowProvider>
                <ReactFlow
                    elements={currentTreatment.diagram!==undefined?(getElements(currentTreatment.diagram)):([])}
                    snapGrid={[15, 15]}
                    style={{ width: "100%", height: 400 }} 
                    elementsSelectable={false}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    snapToGrid={true}
                    onLoad={onLoad}
                    >
                    <Controls/>
                    <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </ReactFlowProvider>
                </div>
          </Col>        
      </Row>
      ):('')}
      
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
              {currentTreatment.disease.symptoms.map((item, idx)=><Badge key={idx} variant="secondary">{item.name}</Badge>)}
              <label>
                <strong>Diagnosis:</strong>
              </label>{" "}
                
              <label>{currentTreatment.disease.diagnosis}</label>
              <label>
                <strong>Prevention:</strong>
              </label>{" "}
                
              <label>{currentTreatment.disease.prevention}</label>
              
              
          </Card.Text>
          </Card.Body>
        </Card>)}
        </Col>
      </Row>
      {currentTreatment.uses!==null&currentTreatment.uses!==""?(
      <Row className="justify-content-md-center">
        <Col md="auto">
        <Card border="light" className="mt-1" style={{ width: '18rem' }}>
          <Card.Body>
          <Card.Title>Drug Treatment</Card.Title>
          <Card.Text>
              <label>
                <strong>Uses:</strong>
              </label>{" "}
                {currentTreatment.uses}
                              
          </Card.Text>
          </Card.Body>
        </Card>
        </Col>
      </Row>
      ):('')}
      <Row className="justify-content-md-center">
        <Col md="auto">
         <ListGroup className="mt-1">
         <ListGroup.Item variant="light">Drugs</ListGroup.Item>
          
          
<NestedList nodes={getDrugsSubstances(currentTreatment)}></NestedList></ListGroup>
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
{ showDiagram &&<DiagramInfo name={currentTreatment.diagram.name} elements={elements} info = {showDiagram} handleCloseInfo={handleCloseInfo}></DiagramInfo> }
{confirm&&< DownloadTreatment treatment={currentTreatment} buttonText={'Download'} text={'All related data will be overwritten!'} name={"Treatment"} onClickMethod={downloadItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm} ></ DownloadTreatment>}
{confirmToOverwrite&&< DownloadTreatment identifier={identifier} treatment={currentTreatment} buttonText={'Overwrite'} text={'We found related disease! Do you want to overwrite this data?'} name={"Treatment"} onClickMethod={updateDisease} onClickMethodCancel={saveDiagram} handleCloseConfirm={handleCloseConfirmToOverwrite} confirm={confirmToOverwrite} ></ DownloadTreatment>}
  </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)      
    }</div>    
  );
}