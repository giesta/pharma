import React from 'react';

import { Modal, Button, Form, Image } from "react-bootstrap";


export default function InfoModal(props) {
    return (
        <div>{console.log(props.info)}
            <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="treatment.algorithm">
                        <Form.Label>Algorithm</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.algorithm}  disabled name="algorithm"/>
                    </Form.Group>  
                    <Image src={props.treatment.algorithm} fluid/>
                    <Form.Group controlId="treatment.title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.title} disabled name="title"/>
                    </Form.Group>
                    <Form.Group controlId="treatment.description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder="" value={props.treatment.description} disabled name="description"/>
                    </Form.Group>
                    <Form.Group controlId="public">
                        <Form.Check  label={"Public"} checked={props.treatment.public?(true):(false)} name="public" disabled/>
                        
                    </Form.Group>
                    {(props.treatment.disease!== null && props.treatment.disease!== undefined)&&(<Form.Group controlId="treatment.disease.name">
                        <Form.Label>Disease</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.treatment.disease.name} disabled name="algorithm"/>
                    </Form.Group>)
                    } 
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal></div>
    )
}