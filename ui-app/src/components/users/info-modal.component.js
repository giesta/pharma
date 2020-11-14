import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function InfoModal(info, user, handleCloseInfo) {
    return (
        <Modal show={info} onHide={handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>User info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={user.name} disabled name="name"/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="" required  value={user.email} disabled name="substance"/>
                    </Form.Group>    
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