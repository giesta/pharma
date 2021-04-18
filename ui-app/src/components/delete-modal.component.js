import React from 'react';

import { Modal, Button } from "react-bootstrap";

export default function ModalDelete(props) {

    return (
<Modal show={props.confirm} onHide={props.handleCloseConfirm}>
        <Modal.Header closeButton>
    <Modal.Title>Trinti {props.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Ar jūs tuo tikras?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleCloseConfirm}>
            Užverti
          </Button>
          <Button variant="primary" onClick={()=>props.deleteItem(props.id)}>
            Trinti
          </Button>
        </Modal.Footer>
      </Modal>
    );
}