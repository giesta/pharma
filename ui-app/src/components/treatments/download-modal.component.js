import React from 'react';

import { Modal, Button } from "react-bootstrap";

export default function ModalDelete(props) {

    return (
<Modal show={props.confirm} onHide={props.handleCloseConfirm}>
        <Modal.Header closeButton>
    <Modal.Title>Download {props.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {props.text}{' '}
  Are you sure?
        </Modal.Body>
        <Modal.Footer>
          {props.onClickMethodCancel!==undefined?(<Button variant="secondary" onClick={()=>props.onClickMethodCancel(-1)}>
            No
          </Button>):(<Button variant="secondary" onClick={props.handleCloseConfirm}>
            Close
          </Button>)}
          
          <Button variant="primary" onClick={props.onClickMethod}>
            {props.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}