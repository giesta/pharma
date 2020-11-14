import React, { useCallback, useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import TreatmentTable from "./table.component";
import TreatmentDelete from "../delete-modal.component";
import TreatmentCreateUpdate from "./create-update-modal.component";
import TreatmentInfo from "./info-modal.component";
import Spinner from "../layout/spinner.component";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";


export default function TreatmentList() {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    disease: null
  };
  const columns = [{  
      dataField: '',  
      text: 'No' },  
    {  
      dataField: 'title',  
      text: 'Title',  
      sort:true}, {  
      dataField: 'description',  
      text: 'Description',  
      sort: true  }, {  
      dataField: 'disease',  
      text: 'Disease',  
      sort: true  },   
      {
      text: 'Actions',
      dataField: 'Actions',
      editable: false 
    }
  ];

  const [treatment, setTreatment] = React.useState(initialTreatmentState);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [url, setUrl] = React.useState(null);

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);

  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
      if(treatment.id===null){
        saveTreatment();
      }else{
        handleInputChange(event); 
        updateTreatment();
      } 
    }
    setValidated(true);       
  };
  const handleClose = () =>{
    newTreatment();
    setShow(false);
    setValidated(false);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newTreatment();
    setInfo(false);
  };
  const [Treatments, setTreatments] = React.useState({
    data: [],
  });
  const [Diseases, setDiseases] = React.useState({
    data: [],
  });
  const handleInputChange = event => {
    const { name, value } = event.target;    
    if(event.target.files!==undefined && event.target.files!==null ){
        setSelectedFile(event.target.files[0]);
        setUrl(URL.createObjectURL(event.target.files[0]));
    }    
    setTreatment({ ...treatment, [name]: value });
  };
  useEffect(()=>{    
        retrieveTreatments();        
  }, []);

  const retrieveTreatments = useCallback(() => {
    TreatmentsDataService.getAll()
      .then(response => {    
        if(response.data.data.length !== 0){
          setTreatments({...Treatments, data: response.data.data});          
        }  
        retrieveDiseases();     
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  
  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setDiseases({...Diseases, data: response.data.data});
        }else{
          setNoData("No data");
        }        
      })
      .catch(e => {
        console.log(e);
      });
  };
  const GetActionFormat = useCallback((row) =>{
    
    return (
        <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setTreatment(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setTreatment(row);
              setShow(true);}}>
                <BsPen></BsPen>
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm"onClick={
              function(event){ setId(row.id); setConfirm(true)}}>
            <BsTrash></BsTrash>
            </button>
        </td>
    );
});

const deleteItemFromState = (id) => {
  const updatedItems = Treatments.data.filter(x=>x.id!==id)
  setTreatments({ data: updatedItems })
}
const saveTreatment = () => {
    const data = new FormData();
    data.append('Content-Type','multipart/formdata');
    if(selectedFile!==null){
        data.append("algorithm", selectedFile);        
    } 
    data.append("title", treatment.title);
    data.append("description", treatment.description);
    data.append("disease_id", treatment.disease_id);
TreatmentsDataService.create(data)
    .then(response => {
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        disease: response.data.data.disease
      });
      setUrl(null);
      handleClose();
      Treatments.data.push(response.data.data);
      setTreatments({...Treatments, data: Treatments.data});
    })
    .catch(e => {
      console.log(e);
    });
};

const updateTreatment = () => {
  const data = new FormData();
  data.append('Content-Type','multipart/formdata');
  data.append('_method', 'PUT');
  if(selectedFile!==null){
      data.append("algorithm", selectedFile);        
  } 
  data.set("title", treatment.title);
  data.set("description", treatment.description);
  if(treatment.disease_id!=null){
    data.set("disease_id", treatment.disease_id);
  }
  
  TreatmentsDataService.update(treatment.id, data)
    .then(response => {
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        disease: response.data.data.disease
      });
      setUrl(null);
      handleClose();
      const updatedItems = Treatments.data.filter(x=>x.id!==treatment.id)
      updatedItems.push(response.data.data);
      setTreatments({...Treatments, data: updatedItems});
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteItem = (id) => {
  TreatmentsDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};
const newTreatment = () => {
  setTreatment(initialTreatmentState);
};
  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {Treatments?(
      Treatments.data.length===0 && noData===''?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">  
      
      <>
  <TreatmentTable columns ={columns} Treatments={Treatments} GetActionFormat={GetActionFormat}></TreatmentTable>

  { show&&<TreatmentCreateUpdate show ={show} handleClose={handleClose} treatment={treatment} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} Diseases={Diseases} url={url}></TreatmentCreateUpdate>}
      
  {confirm&&< TreatmentDelete id={id} name={"Treatment"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm} ></ TreatmentDelete>}

  {info&&<TreatmentInfo info = {info}  treatment={treatment} handleCloseInfo={handleCloseInfo} ></TreatmentInfo>}
      
</>
  </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>
    
    
  );
}