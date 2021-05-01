import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Naudotojo informacija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Vardas</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.user.name} disabled name="name"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>El. paštas</Form.Label>
                        <Form.Control type="text" placeholder="" required  value={props.user.email} disabled name="substance"/>
                    </Form.Group>    
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