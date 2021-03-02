import React from 'react';

import { Modal, Button, Form } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

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
                        <Select
                            name="disease"
                            options={props.options.map(item=>{
                                return { value: item.id, label: item.name };
                            })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            onChange={props.handleDiseaseInputChange}
                            defaultValue={props.disease.disease_id!==null?({value: props.disease.disease_id, label: props.disease.name}):('')}
                        />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={props.disease.description} onChange={props.handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Description is a required field.
                        </Form.Control.Feedback >
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>  
                    <Form.Group controlId="diagnosis">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.diagnosis} onChange={props.handleInputChange} name="diagnosis"/>
                    </Form.Group> 
                    <Form.Group controlId="symptoms"> 
                    <Form.Label>Symptoms</Form.Label>
                    <AsyncSelect
                    name="symptoms"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable="true"
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={props.loadOptions}
                    onChange={props.handleSymptomsInputChange}
                    defaultValue={props.disease.symptoms!==null?(props.disease.symptoms.map(item=>
                        ({value: item.id, label: item.name})
                    
                        )):('')}
                     /> 
                     </Form.Group>                                       
                {
                    <Form.Group controlId="drugs">
                        <Form.Label>Drugs</Form.Label>     
                        <AsyncSelect
                    name="drugs"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable="true"
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={props.loadDrugsOptions}
                    onChange={props.AddSelectedLeaflets}
                    defaultValue={props.disease.drugs!==null?(props.disease.drugs.map(item=>
                        ({value: item.id, label: item.drug.substance})
                    
                        )):('')}
                     />
                    </Form.Group>
                }                    
                     <Form.Group controlId="prevention">
                        <Form.Label>Prevention</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.prevention} onChange={props.handleInputChange} name="prevention"/>
                    </Form.Group>
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