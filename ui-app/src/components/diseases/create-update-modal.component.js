import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Disease info {props.disease.id}</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
                <Modal.Body>  
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.name} onChange={props.handleInputChange} name="name"/>
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={props.disease.description} onChange={props.handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Description is a required field.
                        </Form.Control.Feedback >
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.symptoms} onChange={props.handleInputChange} name="symptoms"/>
                        <Form.Control.Feedback type="invalid">
                            Symptoms is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                {(props.disease.drugs!==null && props.disease.drugs!==undefined)?(
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Drugs</Form.Label>     
                        <Form.Control as="select" multiple defaultValue={props.disease.drugs.map(item=>item.id)} onChange={props.AddSelectedDrugs} name="drugs_id"> 
                            {props.drugs.data.map((x)=>
                                <option value={x.id}>{x.name}</option>
                                )  
                            }
                        </Form.Control>
                    </Form.Group>
                ):(      
                    <Form.Group controlId="exampleForm.ControlSelect1"> 
                        <Form.Label>Drugs</Form.Label>
                        <Form.Control as="select" multiple onChange={props.AddSelectedDrugs} name="drugs_id">   
                            {props.drugs.data.map((x)=>
                                <option value={x.id}>{x.name}</option>
                                )  
                            }
                        </Form.Control>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>)} 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                        {props.disease.id===null?(<Button variant="primary" onClick={props.handleSubmit}>
                            Create Disease
                    </Button>):(<Button variant="primary" onClick={props.handleSubmit}>
                        Update Disease
                    </Button>)}          
                </Modal.Footer>
            </Form>
      </Modal>

    );
}