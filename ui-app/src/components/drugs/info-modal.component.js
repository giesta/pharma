import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Drug info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        
                        {props.leaflet.drug.name.split(';').map(item=>
                        item.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge pill variant="warning">{item.split('(')[0]}</Badge>
                            :<Badge pill variant="success">{item.split('(')[0]}</Badge>
                            )}
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Substance</Form.Label>
                        {props.leaflet.drug.substance.split(/\/|\(|\)/).map(item=>
                        
                        <Badge pill variant="primary">{item}</Badge>
                            
                            )}
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Indication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.indication} disabled name="indication"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Contraindication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.contraindication} disabled name="contraindication"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Adverse effect</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.reaction} disabled name="reaction"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Use</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.use} disabled name="use"/>
                    </Form.Group>
                        {(props.leaflet.diseases!==null && props.leaflet.diseases!==undefined)&&(<Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Diseases</Form.Label>
                            {props.leaflet.diseases.map((x)=>
                                <Badge pill variant="dark">
                                    {x.name}
                                    </Badge>
                                )  
                            } 
                    </Form.Group>
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