import React, { useCallback, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'; 
import DrugsDataService from "../../services/drugs/list.service";
import Fa from 'module';
import { Table, Spinner, Modal, Button } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle } from "react-icons/bs";

export default function MaterialTableDemo() {
  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [drug, setDrug] = React.useState({
    data: [],
  });
  useEffect(()=>{
        retrieveDrugs();
  }, []);
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {
        console.log(response.data.data);
        
          setDrug({...drug, data: response.data.data});
        
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const GetActionFormat = useCallback((row) =>{
    
    return (
        <div>
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setId(row); setShow(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setId(row); setShow(true)}}>
                <BsPen></BsPen>
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm">
            <BsTrash></BsTrash>
            </button>
        </div>
    );
});

const deleteItemFromState = (id) => {
  const updatedItems = drug.data.filter(item => item.id !== id)
  setDrug({ data: updatedItems })
}

const columns = [{  
    dataField: 'id',  
    text: 'Id' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'substance',  
    text: 'Substance',  
    sort: true  },  
  { dataField: 'indication',  
    text: 'Indication',  
    sort: true  },  
  { dataField: 'contraindication',  
text: 'Contraindication',  
    sort: true },  
  {  
    dataField: 'reaction',  
    text: 'Reaction',  
    sort: true  
  }, {  
    dataField: 'use',  
    text: 'Use',  
    sort: true },
 {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
 }
];


  return (
    <div>{drug?(
      drug.data.length==0?(
        <div className="text-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ):(
      <div className="container">  
      <>
 <Table striped bordered hover responsive="lg">
  <thead>
    <tr>
      {columns.map((field)=>
        <th>{field.text}</th>
      )}
    </tr>
  </thead>
  <tbody>

  {drug.data.map((field)=>
        <tr>
        <td>{field.id}</td>
        <td>{field.name}</td>
        <td>{field.substance}</td>
        <td>{field.indication}</td>
        <td>{field.contraindication}</td>
        <td>{field.reaction}</td>
        <td>{field.use}</td>
        <td>{GetActionFormat(field.id)}</td>
      </tr>
      )}  
  </tbody>
</Table>
<Modal show={show} onHide={handleClose} id = {id}>
        <Modal.Header closeButton>
  <Modal.Title>Modal heading {id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
</>
  </div>  )
    ):(<div>
      <br />
      <p>Please click on a Tutorial...</p>
    </div>)
      
    }</div>
    
    
  );
}