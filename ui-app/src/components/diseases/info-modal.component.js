import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(info, disease, handleCloseInfo) {
    return (
        <Modal show={info} onHide={handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Disease info {disease.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={disease.name} disabled name="name"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" required value={disease.description} disabled name="description"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control type="text" placeholder="" required value={disease.symptoms} disabled name="symptoms"/>
                    </Form.Group> 
                    {(disease.drugs!==null && disease.drugs!==undefined)&&(<Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Drugs</Form.Label>
                            {disease.drugs.map((x)=>
                                <Badge pill variant="dark">
                                    {x.name}
                                </Badge>
                                )  
                            } 
                        </Form.Group>)}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal>
    )
}