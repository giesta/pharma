import React from 'react';

import { Modal, Button, Form, Image, Badge } from "react-bootstrap";
import AsyncSelect from 'react-select/async';

export default function CreateModal(props) {
    return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Treatment info</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" validated={props.validated} onSubmit={props.handleSubmit}>
        <Modal.Body>  
            <Form.Group >   
                {props.treatment.id===null?(<Form.Control type = "file" id="algorithm"  label="Algorithm" required onChange={props.handleInputChange} name="algorithm"/> ):(<Form.Control type = "file" id="algorithm"  label="Algorithm" onChange={props.handleInputChange} name="algorithm"/> )}         
                <Form.Control.Feedback type="invalid">
                    File is a required field.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>  
    {props.url===null?(<Image src={props.treatment.algorithm} fluid/>):(<Image src={props.url} fluid/>)}
        <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" placeholder=""  value={props.treatment.title} onChange={props.handleInputChange} name="title"/>
            <Form.Control.Feedback type="invalid">
                Title is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.description} onChange={props.handleInputChange} name="description"/>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="public">
            <Form.Check  label={"Public"} disabled={props.treatment.isBlocked} checked={parseInt(props.treatment.public)} onChange={props.handleChecked} name="public"/>
            {(props.treatment.isBlocked?<Badge pill variant="danger">Blocked</Badge>:"")}
        </Form.Group>
    
        <Form.Group controlId="diseases"> 
            <Form.Label>Diseases</Form.Label>
            <AsyncSelect
                name="diseases"
                ref={props.setSelectRef}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable="true"
                cacheOptions
                defaultOptions
                loadOptions={props.loadOptions}
                onChange={props.handleOverviewsInputChange}
                defaultValue={props.treatment.disease!==null?({value: props.treatment.disease, label: props.treatment.disease.name}):('')}
            /> 
            <Form.Control
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{
                opacity: 0,
                width: "100%",
                height: 0,
                position: "absolute"
                }}
                required
                onFocus={() => props.selectRef.focus()}
                value = {props.treatment.disease || ""}
                onChange={props.handleOverviewsInputChange}
            />
        </Form.Group> 
     
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
            {props.treatment.id===null?(<Button type="submit" variant="primary">
                Create Treatment
            </Button>):(<Button type="submit" variant="primary">
                Update Treatment
            </Button>)}          
        </Modal.Footer>
        </Form>
    </Modal>
    );
}