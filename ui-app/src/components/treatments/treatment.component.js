import React, { useCallback, useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import { Table, Spinner, Modal, Button, InputGroup, FormControl, Form, Image } from "react-bootstrap";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function Treatment(props) {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    disease: null
  };

  const [currentTreatment, setCurrentTreatment] = React.useState(initialTreatmentState);
  const [submitted, setSubmitted] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [url, setUrl] = React.useState(null);

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);

  

  const handleClose = () =>{
    newTreatment();
  };
  const handleShow = () => setShow(true);
  const handleCloseConfirm = () => setConfirm(false);
  const handleConfirm = () => setConfirm(true);
  const handleCloseInfo = () => {
    newTreatment();
    setInfo(false);
  };
  const handleInfo = () => setInfo(true);
  const [Diseases, setDiseases] = React.useState({
    data: [],
  });
  useEffect(()=>{
        getTreatment(props.match.params.id);
  }, [props.match.params.id]);
  const getTreatment = (id) => {
    TreatmentsDataService.get(id)
      .then(response => {   
        console.log(response.data.data)     
        if(response.data.data.length !== 0){
          setCurrentTreatment(response.data.data);
        }else{
          setNoData("No data");
        }       
      })
      .catch(e => {
        console.log(e);
      });
  };


const newTreatment = () => {
  setCurrentTreatment(initialTreatmentState);
  setSubmitted(false);
};


  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
    {console.log(currentTreatment)}
      {currentTreatment?(
      currentTreatment===null?(        
        <div className="text-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ):(        
      <div className="container">  
      
      <>
      <Image src={currentTreatment.algorithm} fluid/>


  
</>
  </div>  )
    ):(<div>
      <br />
      <p>Please click on a Tutorial...</p>
    </div>)
      
    }</div>
    
    
  );
}