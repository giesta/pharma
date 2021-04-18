import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Ligos informacija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.name} disabled/>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.description} disabled/>
                    </Form.Group>
                    <Form.Group controlId="diagnosis">
                        <Form.Label>Diagnozė</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.diagnosis} disabled/>
                    </Form.Group>
                    <Form.Group controlId="prevention">
                        <Form.Label>Prevencija</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.prevention} disabled/>
                    </Form.Group>
                    <Form.Group controlId="symptoms">
                        <Form.Label>Simptomai</Form.Label>
                        {props.disease.symptoms!==undefined??props.disease.symptoms.map(item=>
                           <Badge pill variant="dark"> {item.name}</Badge>
                            )}
                    </Form.Group> {console.log(props.fields)}
                    {(props.fields!==null && props.fields!==undefined)&&(

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
                    {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item)=>
                              item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                              <Badge pill variant="warning">{item.name}</Badge>
                                  :<Badge pill variant="success">{item.name}</Badge>
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


                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Užverti
                </Button>
            </Modal.Footer>
      </Modal>
    )
}