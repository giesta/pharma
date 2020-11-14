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
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.name} disabled name="name"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={props.disease.description} disabled name="description"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.symptoms} disabled name="symptoms"/>
                    </Form.Group> 
                    {(props.disease.drugs!==null && props.disease.drugs!==undefined)&&(<Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Drugs</Form.Label>
                            {props.disease.drugs.map((x)=>
                                <Badge pill variant="dark">
                                    {x.name}
                                </Badge>
                                )  
                            } 
                        </Form.Group>)}
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