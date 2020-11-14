import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(show, handleClose, user, validated, handleSubmit, handleInputChange) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User info</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}> 
            <Modal.Body>  
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="" required value={user.name} onChange={handleInputChange} name="name"/>
                    <Form.Control.Feedback type="invalid">
                        Name is a required field.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="" required value={user.email} onChange={handleInputChange} name="email"/>
                    <Form.Control.Feedback type="invalid">
                        Email is a required field.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {<Button  variant="primary" onClick={handleSubmit}>
                    Update User
                </Button>}          
            </Modal.Footer>
            </Form>
        </Modal>
    );
}