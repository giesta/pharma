import React from 'react';

import { Modal, Button, Form, Image, Badge } from "react-bootstrap";
import ReactFlow, {
    Controls,
    Background,
    ReactFlowProvider,
  } from 'react-flow-renderer'; 

export default function InfoModal(props) {
    const onLoad = (reactFlowInstance) => {
        console.log('flow loaded:', reactFlowInstance);
        reactFlowInstance.fitView({ padding: 0.8, includeHiddenNodes: true });
      };
    function getUsesValue(field, selectedDrug){    

        var arr = field.drugs.find(item=>item.form===selectedDrug.form&&item.strength===selectedDrug.strength&&item.name==selectedDrug.selected[0].name);

      return arr&&arr.uses;
    };
    return (
        <div>
            <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Informacija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>{props.treatment.algorithm!==''?(
                    <>
                    <Form.Group controlId="treatment.algorithm">
                        <Form.Label>Algoritmas</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.algorithm}  disabled name="algorithm"/>
                    </Form.Group>  
                    <Image src={props.treatment.algorithm} fluid/>
                    </>
                    ):''}
                    {props.treatment.diagram!==null?(
            <Form.Group controlId="treatment.diagram"><Form.Label>Diagrama: "{props.treatment.diagram.name}"</Form.Label>
            <div className="mb-4 border">            
                <ReactFlowProvider>
                <ReactFlow
                    elements={props.treatment.diagram!==undefined?(props.getElements(props.treatment.diagram)):([])}
                    snapGrid={[15, 15]}
                    style={{ width: "100%", height: 300 }} 
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
            </Form.Group>
            ):('')}
                    <Form.Group controlId="treatment.title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.title} disabled name="title"/>
                    </Form.Group>
                    <Form.Group controlId="treatment.description">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" value={props.treatment.description} disabled name="description"/>
                    </Form.Group>
                    <Form.Group controlId="uses">
                        <Form.Label>Vaistų vartojimo patikslinimas</Form.Label>
                        <Form.Control type="text" as="textarea" value={props.treatment.uses} disabled name="uses"/>
                        
                    </Form.Group>
                    <Form.Group controlId="public">
                        <Form.Check  label={"Public"} checked={parseInt(props.treatment.public)} name="public" disabled/>
                        
                    </Form.Group>
                    {(props.treatment.disease!== null && props.treatment.disease!== undefined)&&(<Form.Group controlId="treatment.disease.name">
                        <Form.Label>Liga</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.disease.name} disabled name="algorithm"/>
                    </Form.Group>)}
                    {
                        props.fields.map((field, idx)=>{
                        return (
                            <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                            <Form.Group controlId={"drugs"+`${idx}`}>
                            <h4>Vaistas</h4>    
                            <Form.Label>Veiklioji medžiaga</Form.Label>  
                            <Form.Control type="text" placeholder="" value={field.drug.name} disabled/>        
                        </Form.Group>
                        <div>
                        <Form.Label>Pavadinimas</Form.Label>
                                        {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item, idx)=>
                                                  item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                                                  <Badge key={"name_"+idx} pill variant="warning">{item.name}</Badge>
                                                      :<Badge key={"name_"+idx} pill variant="success">{item.name}</Badge>
                                              )):('')
                                              }
                                          </div>
                        <Form.Group controlId={"form"+`${idx}`}>    
                            <Form.Label>Forma</Form.Label>  
                            <Form.Control type="text" placeholder="" value={field.form} disabled/>        
                        </Form.Group>
                        <Form.Group controlId={"strength"+`${idx}`}>    
                            <Form.Label>Stiprumas</Form.Label>  
                            <Form.Control type="text" placeholder="" value={field.strength} disabled/>        
                        </Form.Group>
                        
                            <Form.Group controlId={"uses"+`${idx}`}>    
                            <Form.Label>Vartojimas</Form.Label>  
                            <Form.Control type="text" as="textarea" placeholder="" value={field.uses} disabled/> 
                            </Form.Group> 
                           
                        
                        </div>
                        )
                    })
                    }
                    
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Užverti
                </Button>
            </Modal.Footer>
        </Modal></div>
    )
}