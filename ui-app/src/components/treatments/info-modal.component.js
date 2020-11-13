import React from 'react';

import { Modal, Button, Form, Image } from "react-bootstrap";

export default function InfoModal(info, treatment, handleCloseInfo) {
    return (
        <Modal show={info} onHide={handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="treatment.algorithm">
                        <Form.Label>Algorithm</Form.Label>
                        <Form.Control type="text" placeholder="" value={treatment.algorithm}  disabled name="algorithm"/>
                    </Form.Group>  
                    <Image src={treatment.algorithm} fluid/>
                    <Form.Group controlId="treatment.title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="" value={treatment.title} disabled name="title"/>
                    </Form.Group>
                    <Form.Group controlId="treatment.description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" value={treatment.description} disabled name="description"/>
                    </Form.Group>
                    {(treatment.disease!== null)&&(<Form.Group controlId="treatment.disease.name">
                        <Form.Label>Disease</Form.Label>
                        <Form.Control type="text" placeholder="" value={treatment.disease.name} disabled name="algorithm"/>
                    </Form.Group>)
                    } 
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