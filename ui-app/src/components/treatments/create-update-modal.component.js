import React from 'react';

import { Modal, Button, Form, Image } from "react-bootstrap";

export default function CreateModal(props) {
    return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Treatment info</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" noValidate validated={props.validated} onSubmit={props.handleSubmit}>
        <Modal.Body>  
            <Form.Group >   
                {props.treatment.id===null?(<Form.Control type = "file" id="algorithm"  label="Algorithm" required onChange={props.handleInputChange} name="algorithm"/> ):(<Form.Control type = "file" id="algorithm"  label="Algorithm" onChange={props.handleInputChange} name="algorithm"/> )}         
                <Form.Control.Feedback type="invalid">
                    File is a required field.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>  
    {props.url===null?(<Image src={props.treatment.algorithm} fluid/>):(<Image src={props.url} fluid/>)}
        <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" placeholder=""  value={props.treatment.title} onChange={props.handleInputChange} name="title"/>
            <Form.Control.Feedback type="invalid">
                Title is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.description} onChange={props.handleInputChange} name="description"/>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="public">
            <Form.Check  label={"Public"} checked={parseInt(props.treatment.public)} onChange={props.handleChecked} name="public"/>
            
        </Form.Group>
    {props.treatment.disease!==null?(
        <Form.Group controlId="disease">
            <Form.Label>Disease</Form.Label>     
            <Form.Control as="select" required defaultValue={props.treatment.disease.id} onChange={props.handleInputChange} name="disease_id"> 
                {props.Diseases.data.map((x)=>
                    <option key={x.id} value={x.id}>{x.name}</option>
                )}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
        </Form.Group>
    ):(      
        <Form.Group controlId="disease">
            <Form.Label>Disease</Form.Label>
            <Form.Control as="select" required onChange={props.handleInputChange} name="disease_id" defaultValue={'DEFAULT'}> 
                <option value="DEFAULT" disabled>Select your option</option>
                {props.Diseases.data.map((x)=>
                    <option key={x.id} value={x.id}>{x.name}</option>
                )}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Disease is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>)}  
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
            {props.treatment.id===null?(<Button type="submit" variant="primary">
                Create Treatment
            </Button>):(<Button type="submit" variant="primary">
                Update Treatment
            </Button>)}          
        </Modal.Footer>
        </Form>
    </Modal>
    );
}