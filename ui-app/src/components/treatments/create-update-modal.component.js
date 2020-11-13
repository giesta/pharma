import React from 'react';

import { Modal, Button, Form, Image } from "react-bootstrap";

export default function CreateModal(show, handleClose, treatment, validated, handleSubmit, handleInputChange, diseases, url) {
    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Treatment info</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>  
            <Form.Group >   
                {treatment.id===null?(<Form.Control type = "file" id="exampleFormControlFile1"  label="Algorithm" required onChange={handleInputChange} name="algorithm"/> ):(<Form.Control type = "file" id="exampleFormControlFile1"  label="Algorithm" onChange={handleInputChange} name="algorithm"/> )}         
                <Form.Control.Feedback type="invalid">
                    File is a required field.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>  
    {url===null?(<Image src={treatment.algorithm} fluid/>):(<Image src={url} fluid/>)}
        <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" placeholder=""  value={treatment.title} onChange={handleInputChange} name="title"/>
            <Form.Control.Feedback type="invalid">
                Title is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={treatment.description} onChange={handleInputChange} name="description"/>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>    
    {treatment.disease!==null?(
        <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Disease</Form.Label>     
            <Form.Control as="select" required defaultValue={treatment.disease.id} onChange={handleInputChange} name="disease_id"> 
                {diseases.data.map((x)=>
                    <option value={x.id}>{x.name}</option>
                )}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
        </Form.Group>
    ):(      
        <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Disease</Form.Label>
            <Form.Control as="select" required onChange={handleInputChange} name="disease_id"> 
                <option value="" disabled selected>Select your option</option>
                {diseases.data.map((x)=>
                    <option value={x.id}>{x.name}</option>
                )}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Disease is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>)}  
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            {treatment.id===null?(<Button variant="primary" onClick={handleSubmit}>
                Create Treatment
            </Button>):(<Button variant="primary" onClick={handleSubmit}>
                Update Treatment
            </Button>)}          
        </Modal.Footer>
        </Form>
    </Modal>
    );
}