import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(show, handleClose, disease, validated, handleSubmit, handleInputChange, drugs, AddSelectedDrugs) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Disease info {disease.id}</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>  
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={disease.name} onChange={handleInputChange} name="name"/>
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={disease.description} onChange={handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Description is a required field.
                        </Form.Control.Feedback >
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control type="text" placeholder="" required value={disease.symptoms} onChange={handleInputChange} name="symptoms"/>
                        <Form.Control.Feedback type="invalid">
                            Symptoms is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                {(disease.drugs!==null&&disease.drugs!==undefined)?(
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Drugs</Form.Label>     
                        <Form.Control as="select" multiple defaultValue={disease.drugs.map(item=>item.id)} onChange={AddSelectedDrugs} name="drugs_id"> 
                            {drugs.data.map((x)=>
                                <option value={x.id}>{x.name}</option>
                                )  
                            }
                        </Form.Control>
                    </Form.Group>
                ):(      
                    <Form.Group controlId="exampleForm.ControlSelect1"> 
                        <Form.Label>Drugs</Form.Label>
                        <Form.Control as="select" multiple onChange={AddSelectedDrugs} name="drugs_id">   
                            {drugs.data.map((x)=>
                                <option value={x.id}>{x.name}</option>
                                )  
                            }
                        </Form.Control>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>)} 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                        {disease.id===null?(<Button variant="primary" onClick={handleSubmit}>
                            Create Disease
                    </Button>):(<Button variant="primary" onClick={handleSubmit}>
                        Update Disease
                    </Button>)}          
                </Modal.Footer>
            </Form>
      </Modal>

    );
}