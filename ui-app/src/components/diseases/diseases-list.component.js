import React, { useEffect } from 'react';
import diseasesDataService from "../../services/diseases/list.service";
import SymptomsDataService from "../../services/diseases/symptoms.service";
import DrugsLeafletsDataService from "../../services/drugs/leaflets.serevice";
import DiseaseDelete from "../delete-modal.component";
import DiseaseCreateUpdate from "./create-update-modal.component";
import DiseaseInfo from "./info-modal.component";
import DiseasesTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";

export default function DiseasesList() {

  const initialDiseaseState = {  
    id: null,  
    name: "",
    description: "",
    symptoms: [],
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

  const [options, setOptions] = React.useState([]);
  const [disease, setDisease] = React.useState(initialDiseaseState);
  const [noData, setNoData] = React.useState('');
  const [leaflets, setLeaflets] = React.useState({
    data: [],
  });
  const [symptoms, setSymptoms] = React.useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState([]);

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [selectedLeaflets, setSelectedLeaflets] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [searchTitle, setSearchTitle] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  
  const [validated, setValidated] = React.useState(false);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveDiseases();
    setDisease(initialDiseaseState);
    setPage(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {      
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

  /*const AddSelectedLeaflets = event => {
    
    const selectedLeaflets = [...event.target.selectedOptions].map(o => o.value)
    setSelectedLeaflets(selectedLeaflets);console.log(selectedLeaflets);
  };*/
  const handleInputChange = event => {
    const { name, value } = event.target;
    setDisease({ ...disease,  [name]: value});   
  };

  const loadDrugsOptions = (inputValue, callback) => {    
      DrugsLeafletsDataService.findBySubstance(inputValue)
        .then(response => {        
          if(response.data.data.length !== 0){
            setLeaflets(response.data.data);
            console.log(response.data.data);
            const result = response.data.data.map(x => makeOptions(x));          
           callback(result);
          }        
        })
        .catch(e => {
          console.log(e);
        });
  };

  const loadOptions = (inputValue, callback) => {
    SymptomsDataService.findByTitle(inputValue)
      .then(response => {
        if (response.data.data.length !== 0) {
          console.log(response.data.data);
          const result = response.data.data.map(x => makeOptions(x));          
          callback(result);
        }

      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
function makeOptions(field){
  if(field.drug === undefined){
    return { value: field.id, label: field.name };
  }else{
    return { value: field.id, label: field.drug.substance };
  }
  
} 
  
  
  const handleSymptomsInputChange = event =>
    {
      const arr = event.map(item=>item.value);
      setSelectedSymptoms(arr);
    };

    const AddSelectedLeaflets = event =>
    {
      const arr = event.map(item=>item.value);
      setSelectedLeaflets(arr);
    };
  
  const retrieveSymptoms = () => {
    SymptomsDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setSymptoms(response.data.data);
          console.log(symptoms);
        }        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveDrugsLeaflets = () => {
    DrugsLeafletsDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setLeaflets({...leaflets, data: response.data.data});
        }        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveDiseases = (pageNumber  = 1) => {
    diseasesDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          console.log(response.data.data);
          setDiseases({...diseases, data: response.data.data}); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }else{
          setNoData("No");
        }
        retrieveDrugsLeaflets(); 
        retrieveSymptoms();        
      })
      .catch(e => {
        setError(true);
        
        console.log(e);
      });
  };
  useEffect(retrieveDiseases, []);
  const GetActionFormat = (row) =>{    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setShow(true);setSelectedSymptoms(row.symptoms.map(item=>item.id))}}>
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
  const updatedItems = diseases.data.filter(x=>x.id!==id)
  setDiseases({ data: updatedItems })
}
const saveDisease = () => {
  var data = {
    name: disease.name,
    description: disease.description,
    drugs: JSON.stringify(selectedLeaflets),
    symptoms: JSON.stringify(selectedSymptoms),
  };
  console.log(data);
  diseasesDataService.create(data)
    .then(() => {
      refreshList();
      handleClose();            
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const updateDisease = () => {
  console.log(selectedSymptoms);
  var data = {
    id: disease.id,
    name: disease.name,
    description: disease.description,
    symptoms: JSON.stringify(selectedSymptoms),
    drugs: JSON.stringify(selectedLeaflets)
  };
  diseasesDataService.update(data.id, data)
    .then((resp) => {  
      console.log(resp);
      const updatedItems = diseases.data.filter(x=>x.id!==disease.id)
      updatedItems.push(resp.data.data);
      setDiseases({...diseases, data: updatedItems});
      handleClose();
    })
    .catch(e => {
      setError(true);
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
      setError(true);
      console.log(e);
    });
};

const newDisease = () => {
  setDisease(initialDiseaseState);
};

const findByTitle = () => {
  diseasesDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          setDiseases({...diseases, data: response.data.data}); 
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
      {error?<ErrorBoundary/>:''}
      {diseases?(
      diseases.data.length===0 && noData===''?( 
        <div> <Spinner></Spinner> </div>         
      ):(  
        <div>
          
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
      <DiseasesTable columns ={columns} diseases={diseases} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></DiseasesTable>
      { show && <DiseaseCreateUpdate loadDrugsOptions={loadDrugsOptions} loadOptions={loadOptions} show ={show} handleClose={handleClose} disease={disease} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} AddSelectedLeaflets={AddSelectedLeaflets} handleSymptomsInputChange={handleSymptomsInputChange}></DiseaseCreateUpdate> }
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
  </div> 
  </div>  )
    ):(<div>
      <br />
      <p>Something Went Wrong...</p>
    </div>)      
    }</div> 
      
  );
}