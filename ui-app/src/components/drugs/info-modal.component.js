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
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.name} disabled name="name"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Substance</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.substance} disabled name="substance"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Indication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.indication} disabled name="indication"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Contraindication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.contraindication} disabled name="contraindication"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Adverse effect</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.reaction} disabled name="reaction"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Use</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.use} disabled name="use"/>
                    </Form.Group>
                        {(props.drug.diseases!==null && props.drug.diseases!==undefined)&&(<Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Diseases</Form.Label>
                            {props.drug.diseases.map((x)=>
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