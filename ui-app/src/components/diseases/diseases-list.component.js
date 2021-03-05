import React, { useEffect } from 'react';
import diseasesDataService from "../../services/diseases/list.service";
import SymptomsDataService from "../../services/diseases/symptoms.service";
import DrugsLeafletsDataService from "../../services/drugs/leaflets.serevice";
import DiseaseOverviewsDataService from "../../services/diseases/overviews.service";
import DiseaseDelete from "../delete-modal.component";
import DiseaseCreateUpdate from "./create-update-modal.component";
import DiseaseInfo from "./info-modal.component";
import DiseasesTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";

export default function DiseasesList() {

  

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
  const [selectRef, setSelectRef] = React.useState(null);
  
  const [selectedDisease, setSelectedDisease] = React.useState(null);
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
  const [isWriting, setIsWriting] = React.useState(false);

  const initialDiseaseState = {  
    id: null,
    description: "",
    diagnosis: "",
    prevention: "",
    disease_id:selectedDisease,
    symptoms: [],
    drugs: []
  };
  const [disease, setDisease] = React.useState(initialDiseaseState);

  useEffect(() => {
    if (isWriting) {
      setIsWriting(false);
      setDisease({
        ...disease,
        id:disease.id,
        disease_id: selectedDisease,
        symptoms: disease.symptoms,
        drugs: disease.drugs
      }
      );
    }
  }, [isWriting,selectedDisease]);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveDiseasesOverviews();
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
    setSelectedDisease(null); 
    setIsWriting(true);     
    
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
  const [overviews, setOverviews] = React.useState([]);

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

  const loadDiseasesOptions = (inputValue, callback) => {
    diseasesDataService.findByTitle(inputValue)
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
    const handleDiseaseInputChange = event =>
    {
      setIsWriting(true);
      if(event === null){                
        setSelectedDisease(null);
      }else{
        setSelectedDisease(event.value);        
      }
      
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
  const retrieveDiseasesOverviews = (pageNumber  = 1) => {
    DiseaseOverviewsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          console.log(response.data.data);
          setOverviews(response.data.data); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }else{
          setNoData("No");
        }
        retrieveDrugsLeaflets();     
      })
      .catch(e => {
        setError(true);        
        console.log(e);
      });
  };
  
  useEffect(retrieveDiseasesOverviews, []);
  const GetActionFormat = (row) =>{    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDisease(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){setSelectedDisease(row.disease_id); setDisease(row); setShow(true);setSelectedSymptoms(row.symptoms.map(item=>item.id)); setSelectedLeaflets(row.drugs.map(item=>item.id))}}>
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
  const updatedItems = overviews.filter(x=>x.id!==id);
  setOverviews(updatedItems);
}
const saveDisease = () => {
  var data = {
    disease_id: selectedDisease,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    drugs: JSON.stringify(selectedLeaflets),
    symptoms: JSON.stringify(selectedSymptoms),
  };
  console.log(data);
  DiseaseOverviewsDataService.create(data)
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
  console.log(selectedDisease);
  var data = {
    id: disease.id,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    disease_id: selectedDisease,
    symptoms: JSON.stringify(selectedSymptoms),
    drugs: JSON.stringify(selectedLeaflets)
  };
  DiseaseOverviewsDataService.update(data.id, data)
    .then((resp) => {  
      console.log(resp);
      const updatedItems = overviews.filter(x=>x.id!==disease.id)
      updatedItems.push(resp.data.data);
      setOverviews(updatedItems);
      handleClose();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const deleteItem = (id) => {
  DiseaseOverviewsDataService.remove(id)
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
  DiseaseOverviewsDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        
          setOverviews(response.data.data); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};
  return (
    <div>
      {error?<ErrorBoundary/>:''}
      {overviews?(
      overviews.length===0 && noData===''?( 
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
      <DiseasesTable 
        columns ={columns} 
        diseases={overviews} 
        GetActionFormat={GetActionFormat} 
        rowNumber={(page*5-5)}
      ></DiseasesTable>
      { show && <DiseaseCreateUpdate 
        selectRef = {selectRef} 
        setSelectRef = {setSelectRef} 
        loadDiseasesOptions={loadDiseasesOptions} 
        loadDrugsOptions={loadDrugsOptions} 
        loadOptions={loadOptions} 
        show ={show} 
        handleClose={handleClose} 
        disease={disease} 
        validated={validated} 
        handleSubmit={handleSubmit} 
        handleInputChange={handleInputChange} 
        AddSelectedLeaflets={AddSelectedLeaflets} 
        handleSymptomsInputChange={handleSymptomsInputChange} 
        handleDiseaseInputChange={handleDiseaseInputChange} 
      ></DiseaseCreateUpdate> }
      { confirm && <DiseaseDelete 
        id={id} 
        name={"Disease"} 
        deleteItem={deleteItem} 
        handleCloseConfirm={handleCloseConfirm} 
        confirm={confirm}
      ></DiseaseDelete> }
      { info && <DiseaseInfo info = {info} disease={disease} handleCloseInfo={handleCloseInfo}></DiseaseInfo> }
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDiseasesOverviews(pageNumber)}
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