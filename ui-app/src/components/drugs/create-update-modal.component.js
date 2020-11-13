import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(show, handleClose, drug, validated, handleSubmit, handleInputChange, diseases, AddSelectedDiseases) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Drug</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}> 
                <Modal.Body>  
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.name} onChange={handleInputChange} name="name"/>
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Substance</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.substance} onChange={handleInputChange} name="substance"/>
                        <Form.Control.Feedback type="invalid">
                            Substance is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Indication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.indication} onChange={handleInputChange} name="indication"/>
                        <Form.Control.Feedback type="invalid">
                            Indication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Contraindication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.contraindication} onChange={handleInputChange} name="contraindication"/>
                        <Form.Control.Feedback type="invalid">
                            Contraindication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Adverse effect</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.reaction} onChange={handleInputChange} name="reaction"/>
                        <Form.Control.Feedback type="invalid">
                            Adverse effect is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Use</Form.Label>
                        <Form.Control type="text" placeholder="" required value={drug.use} onChange={handleInputChange} name="use"/>
                        <Form.Control.Feedback type="invalid">
                             Use is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                {(drug.diseases!==null&&drug.diseases!==undefined)?(
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Diseases</Form.Label>     
                        <Form.Control as="select" multiple defaultValue={drug.diseases.map(item=>item.id)} onChange={AddSelectedDiseases} name="diseases_id"> 
                        {diseases.data.map((x)=>
                            <option value={x.id}>{x.name}</option>
                            )  
                        }
                        </Form.Control>  
                    </Form.Group>
                ):(            
                    <Form.Group controlId="exampleForm.ControlSelect1"> 
                        <Form.Label>Diseases</Form.Label>
                        <Form.Control as="select" multiple onChange={AddSelectedDiseases} name="diseases_id">   
                        {diseases.data.map((x)=>
                            <option value={x.id}>{x.name}</option>
                            )  
                        }
                        </Form.Control>
                    </Form.Group>)} 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {drug.id===null?(<Button  variant="primary" onClick={handleSubmit}>
                        Create Drug
                    </Button>):(<Button  variant="primary" onClick={handleSubmit}>
                        Update Drug
                    </Button>)}          
                </Modal.Footer>
            </Form>
        </Modal>
    );
}