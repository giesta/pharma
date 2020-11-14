import React from 'react';

import { Modal, Button } from "react-bootstrap";

export default function ModalDelete(props) {

    return (
<Modal show={props.confirm} onHide={props.handleCloseConfirm}>
        <Modal.Header closeButton>
    <Modal.Title>Delete {props.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>props.deleteItem(props.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
}