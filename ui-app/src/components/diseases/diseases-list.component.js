import React, { useCallback, useEffect } from 'react';
import diseasesDataService from "../../services/diseases/list.service";
import DrugsDataService from "../../services/drugs/list.service";
import DiseaseDelete from "../delete-modal.component";
import DiseaseCreateUpdate from "./create-update-modal.component";
import DiseaseInfo from "./info-modal.component";
import DiseasesTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";


export default function DiseasesList() {

  const initialDiseaseState = {  
    id: null,  
    name: "",
    description: "",
    symptoms: "",
    drugs: []
  };

  const columns = [{  
    dataField: 'no',  
    text: 'No' },  
  {  
    dataField: 'name',  
    text: 'Name',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Description',  
    sort: true  },  
  { dataField: 'symptoms',  
    text: 'Symptoms',  
    sort: true  },  
  {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
  }];

  const [disease, setDisease] = React.useState(initialDiseaseState);
  const [noData, setNoData] = React.useState('');
  const [drugs, setDrugs] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [selectedDrugs, setSelectedDrugs] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  
  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else{
      if(disease.id===null){
        saveDisease();
      }else{
        handleInputChange(event); 
        updateDisease();
      } 
    }
    setValidated(true);       
  };


  const handleClose = () =>{
    newDisease();
    setShow(false);
    setValidated(false);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newDisease();
    setInfo(false);
    setValidated(false);
  };
  const [diseases, setDiseases] = React.useState({
    data: [],
  });

  const AddSelectedDrugs = event => {
    const selectedDrugs = [...event.target.selectedOptions].map(o => o.value)
    setSelectedDrugs(selectedDrugs);
  };
  const handleInputChange = event => {
    const { name, value } = event.target;
    setDisease({ ...disease,  [name]: value});   
  };
  useEffect(()=>{
        retrieveDiseases();        
  }, []);

  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data});
        }        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveDiseases = (pageNumber  = 1) => {
    diseasesDataService.getAllPaginate(pageNumber)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          setDiseases({...diseases, data: response.data.data}); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }
          retrieveDrugs();       
      })
      .catch(e => {
        console.log(e);
      });
  };
  const GetActionFormat = useCallback((row) =>{    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setShow(true)}}>
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
  const updatedItems = diseases.data.filter(x=>x.id!==id)
  setDiseases({ data: updatedItems })
}
const saveDisease = () => {
  var data = {
    name: disease.name,
    description: disease.description,
    symptoms: disease.symptoms,
    drugs: JSON.stringify(selectedDrugs)
  };
  diseasesDataService.create(data)
    .then(response => {
      setDisease({
        id : response.data.data.id,
        name: response.data.data.name,
        description: response.data.data.description,
        symptoms: response.data.data.symptoms,
        drugs: response.data.data.drugs
      });
      diseases.data.push(response.data.data);
      setDiseases({...diseases, data: diseases.data});
      handleClose();            
    })
    .catch(e => {
      console.log(e);
    });
};

const updateDisease = () => {
  var data = {
    id: disease.id,
    name: disease.name,
    description: disease.description,
    symptoms: disease.symptoms,
    drugs: JSON.stringify(selectedDrugs)
  };
  diseasesDataService.update(data.id, data)
    .then((resp) => {  
      const updatedItems = diseases.data.filter(x=>x.id!==disease.id)
      updatedItems.push(resp.data.data);
      setDiseases({...diseases, data: updatedItems});
      handleClose();
    })
    .catch(e => {
      console.log(e);
    });
};

const deleteItem = (id) => {
  diseasesDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      console.log(e);
    });
};

const newDisease = () => {
  setDisease(initialDiseaseState);
};
  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {diseases?(
      diseases.data.length===0 && noData===''?(        
        <Spinner></Spinner>
      ):(        
      <div className="container"> 
      <DiseasesTable columns ={columns} diseases={diseases} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></DiseasesTable>
      { show && <DiseaseCreateUpdate show ={show} handleClose={handleClose} disease={disease} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} drugs={drugs} AddSelectedDrugs={AddSelectedDrugs}></DiseaseCreateUpdate> }
      { confirm && <DiseaseDelete id={id} name={"Disease"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm}></DiseaseDelete> }
      { info && <DiseaseInfo info = {info} disease={disease} handleCloseInfo={handleCloseInfo}></DiseaseInfo> }
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDiseases(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
  </div>  )
    ):(<div>
      <br />
      <p>Something Went Wrong...</p>
    </div>)      
    }</div>    
  );
}