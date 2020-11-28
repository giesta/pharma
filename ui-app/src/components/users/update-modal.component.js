import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User info</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}> 
            <Modal.Body>  
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="" required value={props.user.name} onChange={props.handleInputChange} name="name"/>
                    <Form.Control.Feedback type="invalid">
                        Name is a required field.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="" required value={props.user.email} onChange={props.handleInputChange} name="email"/>
                    <Form.Control.Feedback type="invalid">
                        Email is a required field.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                {<Button type="submit" variant="primary">
                    Update User
                </Button>}          
            </Modal.Footer>
            </Form>
        </Modal>
    );
}