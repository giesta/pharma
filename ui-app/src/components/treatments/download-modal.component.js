import React from 'react';

import { Modal, Button } from "react-bootstrap";

export default function ModalDelete(props) {

    return (
<Modal show={props.confirm} onHide={props.handleCloseConfirm}>
        <Modal.Header closeButton>
    <Modal.Title>Įtraukti {props.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {props.text}{' '}
  Ar jūs tikrai to norite?
        </Modal.Body>
        <Modal.Footer>
          {props.onClickMethodCancel!==undefined?(<Button variant="secondary" onClick={props.onClickMethodCancel}>
            Ne
          </Button>):(<Button variant="secondary" onClick={props.handleCloseConfirm}>
            Užverti
          </Button>)}
          
          <Button variant="primary" onClick={props.onClickMethod}>
            {props.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}