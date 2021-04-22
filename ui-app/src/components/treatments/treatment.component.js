import React, { useEffect, callback, useCallback } from 'react';
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
import { Alert, Col, Row, Button, Jumbotron, Container, Badge, Image, ListGroup, Card, Form, OverlayTrigger, Tooltip, Accordion } from "react-bootstrap";
import { BsStar, BsPeopleCircle, BsExclamationCircle, BsInfoCircle, BsCloudDownload } from "react-icons/bs";
import fetchNodes from "./fetchNodes";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
} from 'react-flow-renderer'; 
const nodes = fetchNodes();
var idDiagram=null;
var idDisease=null;
export default function Treatment(props) {

  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
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
  const [diagramToOverwrite, setDiagramToOverwrite] = React.useState(false);
  const [text, setText] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState(false);
  const [relatedTreatments, setRelatedTreatments] = React.useState([]);
  

  const onChangeComment = e => {
    const comment = e.target.value;
    setComment(comment);
  };
 
  const handleClose = () =>{
    newDrug();
    setShow(false);
  };

  const handleCloseConfirm = () => {
    setConfirm(false);
  };
  const handleCloseConfirmToOverwrite = () => {
    setConfirmToOverwrite(false);
    
  };
  const handleCloseDiagramToOverwrite = () => {
    setDiagramToOverwrite(false);
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

  
  const rate = () => {
    StarService.rate(currentTreatment.id)
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
    ReportService.report(currentTreatment.id)
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

const downloadItem = async () => {
  
  console.log(currentTreatment.disease.name);
  const values = await DiseaseOverviewsDataService.findByTitle(1, currentTreatment.disease.name)
      .then(response => {
          //console.log(response.data);
          if(response.data.data.length > 0){
            idDisease = response.data.data[0].id;
            setText('Mes radome susijusią ligą! Ar norite perrašyti šią "'+currentTreatment.disease.name + '" ligą?');          
          }
          return response.data.data;
          
      })
      //idDisease = values[0].id;
      if(values.length > 0){
        handleCloseConfirm();
        setConfirmToOverwrite(true);
      }else{
        handleCloseConfirm();
        createDisease();
      }
};

const downloadDiagram = async () => {
  const values = await DiagramsDataService.findByTitle(1, currentTreatment.diagram.name)
      .then(response => {
          if(response.data.data.length > 0){            
            for( var i = 0; i < response.data.data.length; i++) {
              if(response.data.data[i].name===currentTreatment.diagram.name&&response.data.data[i].nodes.length===currentTreatment.diagram.nodes.length&&response.data.data[i].edges.length===currentTreatment.diagram.edges.length){
                idDiagram = response.data.data[i].id;
                setText('Mes radome susijusią diagramą! Ar norite perrašyti šią "'+currentTreatment.diagram.name+ '" diagramą?');
                handleCloseConfirmToOverwrite();                
                setDiagramToOverwrite(true);
                break;
              }else{
                handleCloseConfirm(); 
                handleCloseConfirmToOverwrite();       
                saveDiagram();
              }
            }           
          }
          return response.data.data;
          
      })
      if(values.length===0){
        handleCloseConfirm(); 
        handleCloseConfirmToOverwrite();       
        saveDiagram();
      }
};

const updateDisease = async () => {
  console.log(currentTreatment.disease.drugs);
  var drugsArr = currentTreatment.disease.drugs.map(item=>{
    return {selected:[item], uses:item.uses}
  });
  console.log(drugsArr);
  var data = {
    id: idDisease,
    disease_id: currentTreatment.disease.disease_id,
    description: currentTreatment.disease.description,
    diagnosis: currentTreatment.disease.diagnosis,
    prevention: currentTreatment.disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(currentTreatment.disease.symptoms.map(item=>item.id)),
  };console.log(data);
  const value = await DiseaseOverviewsDataService.update(data.id, data)
    .then((resp) => {  
      return resp.data.data;
    })
    .catch(e => {
      console.log(e);
    });
    if(currentTreatment.diagram !==null){
      downloadDiagram();
    }else{
      saveTreatment(idDisease);
    }
};
const createDisease = async () => {
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
  const value = await DiseaseOverviewsDataService.create(data)
    .then((resp) => {  
      idDisease = resp.data.data.id;
      return resp.data.data; 
    })
    .catch(e => {
      console.log(e);
    });
    if(currentTreatment.diagram !==null){
      downloadDiagram();
    }else{
      saveTreatment(idDisease);
    }
};

const saveTreatment =async () => {
  var drugsArr = currentTreatment.drugs;
  var newArr = [];
newArr = [].concat(...drugsArr);
drugsArr = newArr.map(item=>{
  return {id: item.id, uses:item.uses}
});
var data = {
  treatment_id:currentTreatment.id,
  title:currentTreatment.title,
  description:currentTreatment.description,
  overview_id:idDisease,
  public: 0,
  uses:currentTreatment.uses,
  drugs:JSON.stringify(drugsArr),
};
if(currentTreatment.diagram!==null){  
  data['diagram_id']= idDiagram;
};
if(currentTreatment.algorithm!==''){
  data['algorithm']= currentTreatment.algorithm;
  handleCloseConfirmToOverwrite();
}else{
  data['algorithm']= '';
}

    console.log(data);
const value = await TreatmentsDataService.create(data)
    .then((response) => {
      return response.data.data;
    })
    .catch(e => {
      console.log(e);
    });
    handleClose();
    handleCloseConfirm();
    handleCloseDiagramToOverwrite();
    //
    setSuccessMessage(true);
};

const saveDiagram = async () => {
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
  const value = await DiagramsDataService.create(data)
    .then((response) => {
      idDiagram = response.data.data.id;
      return response.data.data;
    })
    .catch(e => {
      console.log(e);
    });
    idDiagram = value.id;
    if(value.id !== null){
      saveTreatment();
    }    
};

const updateDiagram = async () => { 
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
  const value = await DiagramsDataService.update(idDiagram, data)
    .then((response) => {
      return response.data.data;   
    })
    .catch(e => {
      console.log(e);
    });
    saveTreatment();
    
};

const getRelatedTreatments =()=>{
  if(currentTreatment.diagram!== undefined){
      let values = currentTreatment.diagram.related_treatments.map((item, idx)=>{
                      
      if(item.id !== currentTreatment.id && currentTreatment.diagram.author === userData.id){
        
        return (<><a key={"related_"+idx} href={"/treatments/" + item.id}>"{item.title}"{' '}</a><br></br></>)
      }else if(item.id !== currentTreatment.id && item.public===1){
        return (<><a key={"related_"+idx} href={"/treatments/" + item.id}>"{item.title}"{' '}</a><br></br></>)
      }                  
    });
    setRelatedTreatments(values);
  }  
};
useEffect(getRelatedTreatments, [currentTreatment])
  
  return (
    <div>
      {console.log(currentTreatment)}
      {currentTreatment?(
      currentTreatment.disease === null && noData === ''?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">
        {successMessage?(
          <Row className="mt-2">
            <Col>
              <Alert variant="success" onClose={() => setSuccessMessage(false)} dismissible>Operacija atlikta sėkmingai</Alert>
            </Col>
          </Row>
        ):''}
        
      <Row>
        <Col>
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-rate-1">{currentTreatment.isStar?('Įvertinta'):('Įvertinti')}</Tooltip>}
          ><span className="d-inline-block">
          <Button variant="secondary" size="sm" disabled={currentTreatment.isStar} style={currentTreatment.isStar?( {pointerEvents: 'none' }):({})} onClick={rate}>
            <BsStar></BsStar>{' '}<Badge variant="light">{currentTreatment.stars}</Badge>
          </Button>
          </span>
          </OverlayTrigger>{' '}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-download-1">Įtraukti į asmeninį sąrašą</Tooltip>}
          >
          <Button variant="outline-info" size="sm" onClick={()=>{if(currentTreatment.diagram!==null){setElements(getElements(currentTreatment.diagram))};setConfirm(true);}}> <BsCloudDownload/>{' '}
          </Button>
          </OverlayTrigger>
        </Col>
        <Col>
          <Button className="float-right" variant="outline-secondary" size="sm" disabled={currentTreatment.isReported} onClick={report}>{currentTreatment.isReported?('Siūlymas šalinti priimtas'):('Siūlau šalinti')} {" "}
            <BsExclamationCircle></BsExclamationCircle>
          </Button>
        </Col>        
    </Row>
    <Row>
        <Col className="mt-2">
         <Jumbotron fluid>
          <Container>
            <h2>{currentTreatment.title}</h2>
            <p>
              {currentTreatment.description}
            </p>
          </Container>
         </Jumbotron>
          </Col>        
        </Row>
        {currentTreatment.algorithm!==''?(
        <Row className="mb-2"><Col></Col>
        <Col className="col-md-auto"><a target="_blank" href={currentTreatment.algorithm}><Image src={currentTreatment.algorithm} fluid/></a></Col>        
        <Col></Col>
      </Row>
      ):('')}
      
      {currentTreatment.diagram!==null?(
        <Row>
        <Col>
          <div>
            <h6>Diagrama: "{currentTreatment.diagram.name}" {" "}
          </h6>
          </div>

          
             
        <div className=" mt-2 border">   
              
                <ReactFlowProvider>
                <ReactFlow
                    elements={currentTreatment.diagram!==undefined?(getElements(currentTreatment.diagram)):([])}
                    snapGrid={[15, 15]}
                    style={{ width: "100%", height: 600 }} 
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
      <Col>
      <div>
        {relatedTreatments.length>0?(                    
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                <h6>Susiję gydymo algoritmai</h6>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>{relatedTreatments.map(item=>{return item})}</Card.Body>
              </Accordion.Collapse>
              </Card>
          </Accordion>          
          ):('')}        
      </div>
      </Col>
    </Row>
      
        <Row className="justify-content-md-center">
        <Col>
          {currentTreatment.disease!==null&&(
        <Card border="light" className="mt-1  w-100">
          <Card.Body>
          <Card.Title>Ligos informacija:</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{currentTreatment.disease.name}</Card.Subtitle>
          <Card.Text>
              <label>
                <strong>Aprašymas:</strong>
              </label>{" "}
                {currentTreatment.disease.description}
              <label>
                <strong>Simptomai:</strong>
              </label>{" "}{console.log(currentTreatment.disease.symptoms)}
              {currentTreatment.disease.symptoms.map((item, idx)=>{
                return  <><Badge key={idx} variant="secondary">{item.name}</Badge><br /></>
                  
              })}
              <label>
                <strong>Diagnozė:</strong>
              </label>{" "}
                
              <label>{currentTreatment.disease.diagnosis}</label>
              <label>
                <strong>Prevencija:</strong>
              </label>{" "}
                
              <label>{currentTreatment.disease.prevention}</label>
              
              
          </Card.Text>
          </Card.Body>
        </Card>)}
        </Col>
      </Row>
      {currentTreatment.uses!==null&currentTreatment.uses!==""?(
      <Row className="justify-content-md-center">
        <Col>
        <Card border="light" className="mt-1  w-100">
          <Card.Body>
          <Card.Title>Gydymas vaistais</Card.Title>
          <Card.Text>
              <label>
                <strong>Vartojimas:</strong>
              </label>{" "}
                {currentTreatment.uses}
                              
          </Card.Text>
          </Card.Body>
        </Card>
        </Col>
      </Row>
      ):('')}
      <Row className="justify-content-md-center">
        <Col>
         <ListGroup className="mt-1">
         <ListGroup.Item variant="light">Vaistai:</ListGroup.Item>
          
          
<NestedList nodes={getDrugsSubstances(currentTreatment)}></NestedList></ListGroup>
        </Col>   
        </Row>
      <div className="container mt-4">
      <Row>
        <Col className="border-bottom border-dark">        
          <h5>Diskusija:</h5>       
        </Col>
        </Row>
        <Row>
        <Col></Col>
        <Col className="col-9">
            <ListGroup variant="flush">
              {currentTreatment.comments.length!==0?(currentTreatment.comments.map((field)=>
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
              )):(<div className="mt-2">
                <p>Pradėkite diskusiją</p>
              </div>
                
                )}            
          </ListGroup> 
        </Col>
        <Col></Col>
        </Row>
        {userData!==null?(
      <Row>
        <Col></Col>
        <Col className="col-9">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="Comment">
            <Form.Control className="border border-secondary rounded" as="textarea" required rows={3} placeholder="Jūsų nuomonė" value = {comment} onChange={onChangeComment}/>
            <Form.Control.Feedback type="invalid">
              Komentaras negali būti tuščias.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="secondary" className="mb-2">
            Skelbti
          </Button>
        </Form>
        
        </Col>
        <Col></Col>
        </Row>):('')}
      </div>
{ show &&<DrugInfo info = {show} leaflet = {drug} handleCloseInfo={handleClose}></DrugInfo> } 
{ showDiagram &&<DiagramInfo name={currentTreatment.diagram.name} elements={elements} info = {showDiagram} handleCloseInfo={handleCloseInfo}></DiagramInfo> }
{confirm&&< DownloadTreatment treatment={currentTreatment} buttonText={'Įtraukti'} text={'Visa susijusi informacija gali būti perrašyta!'} name={"gydymo algoritmą"} onClickMethod={downloadItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm} ></ DownloadTreatment>}
{confirmToOverwrite&&< DownloadTreatment identifier={idDisease} treatment={currentTreatment} buttonText={'Perrašyti'} text={text} name={"ligą"} onClickMethod={updateDisease} onClickMethodCancel={currentTreatment.diagram!==null?downloadDiagram:saveTreatment} handleCloseConfirm={handleCloseConfirmToOverwrite} confirm={confirmToOverwrite} ></ DownloadTreatment>}
{diagramToOverwrite&&< DownloadTreatment identifier={idDiagram} treatment={currentTreatment} buttonText={'Perrašyti'} text={text} name={"diagramą"} onClickMethod={updateDiagram} onClickMethodCancel={saveTreatment} handleCloseConfirm={handleCloseDiagramToOverwrite} confirm={diagramToOverwrite} ></ DownloadTreatment>}
  </div>  )
    ):(<div>
      <br />
      <p>Kažkas blogai...</p>
    </div>)      
    }</div>    
  );
}