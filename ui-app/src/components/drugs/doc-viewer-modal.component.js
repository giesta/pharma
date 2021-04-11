import React from 'react';
import { Modal, Button, Form, Badge} from "react-bootstrap";

export default function InfoModal(props) {
    return (
        <Modal size="xl" show={props.view} onHide={()=>props.setView(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Drug info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <iframe
        src={"https://docs.google.com/viewer?url=" + props.docs + "&embedded=true"}
        title="file"
        width="100%"
        height="600"
      ></iframe>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{props.setView(false);props.setDocs('');}}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}