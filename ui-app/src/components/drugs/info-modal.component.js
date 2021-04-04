import React from 'react';
import DateParser from "../../services/parseDate.service";
import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Drug info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        
                        {
                        props.drug.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge pill variant="warning">{props.drug.name}</Badge>
                            :<Badge pill variant="success">{props.drug.name}</Badge>
                            }
                    </Form.Group>
                    <Form.Group controlId="substance">
                        <Form.Label>Substance</Form.Label>
                        {props.drug.substance.name===undefined?(props.drug.substance.split(/\/|\(|\)/).map(item=>
                        
                        <Badge pill variant="primary">{item}</Badge>
                            
                            )):(props.drug.substance.name.split(/\/|\(|\)/).map(item=>
                        
                                <Badge pill variant="primary">{item}</Badge>
                                    
                                    ))}
                    </Form.Group>
                    <Form.Group controlId="atc">
                        <Form.Label>ATC</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.ATC!==null?(props.drug.ATC):(props.drug.substance.ATC)} disabled name="indication"/>
                    </Form.Group>
                    <Form.Group controlId="strength">
                        <Form.Label>Strength</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.strength} disabled name="contraindication"/>
                    </Form.Group>
                    <Form.Group controlId="form">
                        <Form.Label>Form</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.form} disabled name="reaction"/>
                    </Form.Group>
                    <Form.Group controlId="package">
                        <Form.Label>Package</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.package} disabled name="use"/>
                    </Form.Group>
                    <Form.Group controlId="package_description">
                        <Form.Label>Package Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.drug.package_description} disabled name="use"/>
                    </Form.Group>
                    {props.drug.uses!==undefined?( 
                    <Form.Group controlId="uses">
                        <Form.Label>Uses</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.drug.uses} disabled name="use"/>
                    </Form.Group>
                    ):('')}
                   
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Updated</Form.Label>
                        <Form.Control type="text" placeholder="" value={DateParser.getParsedDate(props.drug.updated_at)} disabled name="use"/>
                    </Form.Group>
                        
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}