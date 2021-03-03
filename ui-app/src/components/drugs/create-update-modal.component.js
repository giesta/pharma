import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";
import {Select} from 'react-select-virtualized';
import AsyncSelect from 'react-select/async';

export default function CreateModal(props) {
    const options = props.drugsList.data.map(x=>makeOptions(x));
      function makeOptions(field){
        return { value: field, label: field.substance.substring(0, 58) };
      } 
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Drug</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}> 
                <Modal.Body> 
                <Form.Group controlId="name">                  
                <Select
                    name="drugs"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={props.handleSelectChange}
                    isClearable="true"
                    defaultValue={props.leaflet.drug.id!==null?({value: props.leaflet.drug.id, label: props.leaflet.drug.substance.substring(0, 58)}):('')}
                />                
                </Form.Group> 
                {(props.leaflet.drug.id!==null)?( 
                <Form.Group controlId="name">
                        <Form.Label>Names</Form.Label>
                        
                        {props.leaflet.drug.name.split(';').map(item=>
                        item.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge pill variant="warning">{item.split('(')[0]}</Badge>
                            :<Badge pill variant="success">{item.split('(')[0]}</Badge>
                            )}
                    </Form.Group>):('') }             
                    {(props.leaflet.drug.id!==null)?(    
                    <Form.Group controlId="substance">
                        <Form.Label>Substances</Form.Label>
                        
                        {props.leaflet.drug.substance.split(/\/|\(|\)/).map(item=>
                        
                        <Badge pill variant="primary">{item}</Badge>
                            
                            )}
                        
                    </Form.Group>):('')}
                    <Form.Group controlId="indication">
                        <Form.Label>Indication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.indication} onChange={props.handleInputChange} name="indication"/>
                        <Form.Control.Feedback type="invalid">
                            Indication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="contraindication">
                        <Form.Label>Contraindication</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.contraindication} onChange={props.handleInputChange} name="contraindication"/>
                        <Form.Control.Feedback type="invalid">
                            Contraindication is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="reaction">
                        <Form.Label>Adverse effect</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.reaction} onChange={props.handleInputChange} name="reaction"/>
                        <Form.Control.Feedback type="invalid">
                            Adverse effect is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="use">
                        <Form.Label>Use</Form.Label>
                        <Form.Control type="text" placeholder="" required value={props.leaflet.use} onChange={props.handleInputChange} name="use"/>
                        <Form.Control.Feedback type="invalid">
                             Use is a required field.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>                    
                    <Form.Group controlId="symptoms"> 
                    <Form.Label>Diseases</Form.Label>
                    <AsyncSelect
                        name="symptoms"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isClearable="true"
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={props.loadOptions}
                        onChange={props.handleOverviewsInputChange}
                        defaultValue={props.leaflet.diseases!==null?(props.leaflet.diseases.map(item=>
                            ({value: item.id, label: item.name})
                        
                            )):('')}
                     /> 
                     </Form.Group> 

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    {props.leaflet.id===undefined||props.leaflet.id===null?(<Button type="submit" variant="primary">
                        Create Drug
                    </Button>):(<Button type="submit" variant="primary">
                        Update Drug
                    </Button>)}          
                </Modal.Footer>
            </Form>
        </Modal>
    );
}