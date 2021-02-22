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
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.name} onChange={props.handleInputChange} name="name"/>
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={props.disease.description} onChange={props.handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Description is a required field.
                        </Form.Control.Feedback >
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="symptoms">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.disease.symptoms} onChange={props.handleInputChange} name="symptoms"/>
                        <Form.Control.Feedback type="invalid">
                            Symptoms is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                {(props.disease.drugs!==null && props.disease.drugs!==undefined)?(
                    <Form.Group controlId="drugs">
                        <Form.Label>Drugs</Form.Label>     
                        <Form.Control as="select" multiple defaultValue={props.disease.drugs.map(item=>item.id)} onChange={props.AddSelectedLeaflets} name="drugs_id"> 
                            {props.leaflets.data.map((x)=>
                                <option key={x.id} value={x.id}>{x.drug.substance}</option>
                                )  
                            }
                        </Form.Control>
                    </Form.Group>
                ):(      
                    <Form.Group controlId="drugs"> 
                        <Form.Label>Drugs</Form.Label>
                        <Form.Control as="select" multiple onChange={props.AddSelectedLeaflets} name="drugs_id">   
                            {props.leaflets.data.map((x)=>
                            
                                <option key={x.id} value={x.id}>{x.drug.substance}</option>
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
                        {props.disease.id===null?(<Button type="submit" variant="primary">
                            Create Disease
                    </Button>):(<Button type="submit" variant="primary">
                        Update Disease
                    </Button>)}          
                </Modal.Footer>
            </Form>
      </Modal>

    );
}