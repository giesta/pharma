import React, { useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import TreatmentTable from "./table.component";
import TreatmentDelete from "../delete-modal.component";
import TreatmentCreateUpdate from "./create-update-modal.component";
import TreatmentInfo from "./info-modal.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";

export default function TreatmentList() {

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    public: 0,
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
      sort: true  }, {  
      dataField: 'public',  
      text: 'Public',  
      sort: false  },   
      {
      text: 'Actions',
      dataField: 'Actions',
      editable: false 
    }
  ];

  const [treatment, setTreatment] = React.useState(initialTreatmentState);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [url, setUrl] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [error, setError] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const [searchTitle, setSearchTitle] = React.useState("");

  const [validated, setValidated] = React.useState(false);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveTreatments();
    setTreatment(initialTreatmentState);
    setPage(1);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
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
  const handleChecked = event =>{
    setTreatment({ ...treatment, public: event.target.checked ? 1 : 0 });
  };
  

  const retrieveTreatments = (pageNumber=1) => {
    TreatmentsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => { 
        const { current_page, per_page, total } = response.data.meta;   
        if(response.data.data.length !== 0){
          setTreatments({...Treatments, data: response.data.data});
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }else{
          setNoData("No");
        }
        retrieveDiseases();     
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
  
  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setDiseases({...Diseases, data: response.data.data});
        }        
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
  useEffect(retrieveTreatments, []);
  const GetActionFormat = (row) =>{
    
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
};

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
    data.append("public", treatment.public);
TreatmentsDataService.create(data)
    .then(() => {
      refreshList();
      setUrl(null);
      handleClose();
    })
    .catch(e => {
      setError(true);
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
  data.set("public", treatment.public);
  if(treatment.disease_id!=null){
    data.set("disease_id", treatment.disease_id);
  }
  
  TreatmentsDataService.update(treatment.id, data)
    .then(response => {
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        public: response.data.data.public,
        disease: response.data.data.disease
      });
      setUrl(null);
      handleClose();
      const updatedItems = Treatments.data.filter(x=>x.id!==treatment.id)
      updatedItems.push(response.data.data);
      setTreatments({...Treatments, data: updatedItems});
    })
    .catch(e => {
      setError(true);
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
      setError(true);
      console.log(e);
    });
};
const newTreatment = () => {
  setTreatment(initialTreatmentState);
};
const findByTitle = () => {
  TreatmentsDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          setTreatments({...Treatments, data: response.data.data}); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }
      console.log(response.data.data);
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};
  return (
    <div>
      {Treatments?(
      Treatments.data.length === 0 && noData === ''?(        
        <Spinner></Spinner>
      ):(   
        <div>
          {error?<ErrorBoundary/>:''}
        <div className="d-flex justify-content-between">
        <div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
          
    </div>
          <div className="col-md-6">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div> 
    </div>          
      <div className="container">  
      
      <>
  <TreatmentTable columns ={columns} Treatments={Treatments} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></TreatmentTable>

  { show&&<TreatmentCreateUpdate show ={show} handleClose={handleClose} treatment={treatment} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} handleChecked={handleChecked} Diseases={Diseases} url={url}></TreatmentCreateUpdate>}
      
  {confirm&&< TreatmentDelete id={id} name={"Treatment"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm} ></ TreatmentDelete>}

  {info&&<TreatmentInfo info = {info}  treatment={treatment} handleCloseInfo={handleCloseInfo} ></TreatmentInfo>}
  <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveTreatments(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
      
</>
  </div> </div> )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>
    
    
  );
}