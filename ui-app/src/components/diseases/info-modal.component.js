import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Disease info {props.disease.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.name} disabled/>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.description} disabled/>
                    </Form.Group>
                    <Form.Group controlId="diagnosis">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.diagnosis} disabled/>
                    </Form.Group>
                    <Form.Group controlId="prevention">
                        <Form.Label>Prevention</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.prevention} disabled/>
                    </Form.Group>
                    <Form.Group controlId="symptoms">
                        <Form.Label>Symptoms</Form.Label>
                        {props.disease.symptoms!==undefined??props.disease.symptoms.map(item=>
                           <Badge pill variant="dark"> {item.name}</Badge>
                            )}
                    </Form.Group> {console.log(props.fields)}
                    {(props.fields!==null && props.fields!==undefined)&&(

props.fields.map((field, idx)=>{
    return (
        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
        <Form.Group controlId={"drugs"+`${idx}`}>
        <h4>Drug</h4>    
        <Form.Label>Substance</Form.Label>  
        <Form.Control type="text" placeholder="" value={field.drug.name} disabled/>        
    </Form.Group>
    <div>
    <Form.Label>Names</Form.Label>
                    {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item)=>
                              item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                              <Badge pill variant="warning">{item.name}</Badge>
                                  :<Badge pill variant="success">{item.name}</Badge>
                          )):('')
                          }
                      </div>
    <Form.Group controlId={"form"+`${idx}`}>    
        <Form.Label>Form</Form.Label>  
        <Form.Control type="text" placeholder="" value={field.form} disabled/>        
    </Form.Group>
    <Form.Group controlId={"strength"+`${idx}`}>    
        <Form.Label>Strength</Form.Label>  
        <Form.Control type="text" placeholder="" value={field.strength} disabled/>        
    </Form.Group>
    <Form.Group controlId={"uses"+`${idx}`}>    
        <Form.Label>Uses</Form.Label>  
        <Form.Control type="text" as="textarea" placeholder="" value={field.uses} disabled/> 
    </Form.Group>     
    
    </div>
    )
})


                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal>
    )
}