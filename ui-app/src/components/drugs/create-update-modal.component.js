import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";

export default function CreateModal(props) {
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Drug</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}> 
                <Modal.Body>  
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.name} onChange={props.handleInputChange} name="name"/>
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="substance">
                        <Form.Label>Substance</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.substance} onChange={props.handleInputChange} name="substance"/>
                        <Form.Control.Feedback type="invalid">
                            Substance is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="indication">
                        <Form.Label>Indication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.indication} onChange={props.handleInputChange} name="indication"/>
                        <Form.Control.Feedback type="invalid">
                            Indication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="contraindication">
                        <Form.Label>Contraindication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.contraindication} onChange={props.handleInputChange} name="contraindication"/>
                        <Form.Control.Feedback type="invalid">
                            Contraindication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="reaction">
                        <Form.Label>Adverse effect</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.reaction} onChange={props.handleInputChange} name="reaction"/>
                        <Form.Control.Feedback type="invalid">
                            Adverse effect is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="use">
                        <Form.Label>Use</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.drug.use} onChange={props.handleInputChange} name="use"/>
                        <Form.Control.Feedback type="invalid">
                             Use is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                {(props.drug.diseases!==null && props.drug.diseases!==undefined)?(
                    <Form.Group controlId="diseases">
                        <Form.Label>Diseases</Form.Label>     
                        <Form.Control as="select" multiple defaultValue={props.drug.diseases.map(item=>item.id)} onChange={props.AddSelectedDiseases} name="diseases_id"> 
                        {props.diseases.data.map((x)=>
                            <option key={x.id} value={x.id}>{x.name}</option>
                            )  
                        }
                        </Form.Control>  
                    </Form.Group>
                ):(            
                    <Form.Group controlId="diseases_id"> 
                        <Form.Label>Diseases</Form.Label>
                        <Form.Control as="select" multiple onChange={props.AddSelectedDiseases} name="diseases_id">   
                        {props.diseases.data.map((x)=>
                            <option key={x.id} value={x.id}>{x.name}</option>
                            )  
                        }
                        </Form.Control>
                    </Form.Group>)} 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    {props.drug.id===null?(<Button type="submit" variant="primary">
                        Create Drug
                    </Button>):(<Button type="submit" variant="primary">
                        Update Drug
                    </Button>)}          
                </Modal.Footer>
            </Form>
        </Modal>
    );
}