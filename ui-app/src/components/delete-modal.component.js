import React from 'react';

import { Modal, Button } from "react-bootstrap";

export default function ModalDelete(id, name, deleteTreatment, handleCloseConfirm, confirm) {

    return (
<Modal show={confirm} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
    <Modal.Title>Delete {name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>deleteTreatment(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
}