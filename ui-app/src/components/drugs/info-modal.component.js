import React from 'react';
import DateParser from "../../services/parseDate.service";
import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Vaisto informacija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Pavadinimas</Form.Label>                        
                        {
                        props.drug.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge pill variant="warning">{props.drug.name}</Badge>
                            :<Badge pill variant="success">{props.drug.name}</Badge>
                            }
                    </Form.Group>
                    <Form.Group controlId="substance">
                        <Form.Label>Veiklioji mežiaga</Form.Label>
                        {props.drug.substance.name===undefined?(props.drug.substance.split(/\/|\(|\)/).map((item, idx)=>
                        
                        <Badge key={"badge_"+idx} pill variant="primary">{item}</Badge>
                            
                            )):(props.drug.substance.name.split(/\/|\(|\)/).map((item, idx)=>
                        
                                <Badge key={"badge_"+idx} pill variant="primary">{item}</Badge>
                                    
                                    ))}
                    </Form.Group>
                    <Form.Group controlId="atc">
                        <Form.Label>ATC</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.ATC!==null?(props.drug.ATC):(props.drug.substance.ATC)} disabled name="indication"/>
                    </Form.Group>
                    <Form.Group controlId="strength">
                        <Form.Label>Stiprumas</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.strength} disabled name="contraindication"/>
                    </Form.Group>
                    <Form.Group controlId="form">
                        <Form.Label>Forma</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.form} disabled name="reaction"/>
                    </Form.Group>
                    <Form.Group controlId="package">
                        <Form.Label>Pakuotė</Form.Label>
                        <Form.Control type="text" placeholder="" value={props.drug.package} disabled name="use"/>
                    </Form.Group>
                    <Form.Group controlId="package_description">
                        <Form.Label>Pakuotės aprašymas</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.drug.package_description} disabled name="use"/>
                    </Form.Group>
                    {props.drug.uses!==undefined && props.drug.uses!==null?( 
                    <Form.Group controlId="uses">
                        <Form.Label>Vartojimas</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.drug.uses} disabled name="use"/>
                    </Form.Group>
                    ):('')}
                   
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Atnaujinta</Form.Label>
                        <Form.Control type="text" placeholder="" value={DateParser.getParsedDate(props.drug.updated_at)} disabled name="use"/>
                    </Form.Group>
                        
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Užverti
                </Button>
            </Modal.Footer>
        </Modal>
    )
}