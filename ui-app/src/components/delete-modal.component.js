import React from 'react';

import { Modal, Button } from "react-bootstrap";
import ErrorBoundary from "./layout/error.component";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { errors: state.rootReducer.errors };
};

function ModalDelete(props) {

    return (
<Modal show={props.confirm} onHide={props.handleCloseConfirm}>
  <Modal.Header closeButton>                 
    <Modal.Title>Trinti {props.name}</Modal.Title>
  </Modal.Header>
    {props.errors.length > 0 ?<ErrorBoundary text={props.errors.map(item=>item)} handleClose={props.handleCloseConfirm}/>:(
      <Modal.Body>
      Ar jūs tuo tikras?
            </Modal.Body>
    )} 
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleCloseConfirm}>
            Užverti
          </Button>
          <Button 
          variant="primary"
          disabled={props.errors.length > 0} 
           onClick={()=>props.deleteItem(props.id)}
           >
            Trinti
          </Button>
        </Modal.Footer>
      </Modal>
    );
}
const Deletion = connect(mapStateToProps)(ModalDelete);
export default Deletion;