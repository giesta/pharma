import React, { useEffect } from 'react';
import diseasesDataService from "../../services/diseases/list.service";
import SymptomsDataService from "../../services/diseases/symptoms.service";
import DrugsSubstancesDataService from "../../services/drugs/substances.service";
import DiseaseOverviewsDataService from "../../services/diseases/overviews.service";
import DiseaseDelete from "../delete-modal.component";
import DiseaseCreateUpdate from "./create-update-modal.component";
import DiseaseInfo from "./info-modal.component";
import DiseasesTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { removeError } from "../../js/actions/index";
import store from "../../js/store/index";

export default function DiseasesList() { 

  const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'description',  
    text: 'Aprašymas',  
    sort: true  },  
  { dataField: 'symptoms',  
    text: 'Simptomai',  
    sort: true  },  
  {
    text: 'Veiksmai',
    dataField: 'Actions',
    editable: false 
  }];
  const [selectRef, setSelectRef] = React.useState(null);
  
  const [selectedDisease, setSelectedDisease] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [selectedSymptoms, setSelectedSymptoms] = React.useState([]);

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [searchTitle, setSearchTitle] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  
  const [validated, setValidated] = React.useState(false);
  const [isWriting, setIsWriting] = React.useState(false);

  const [fields, setFields] = React.useState([]);

  const {dispatch} = store;


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
  }, [isWriting,selectedDisease, disease]);

  function handleAddInput() {
    const values = [...fields];
    values.push({
      drug: '',
      uses:'',
      form:'',
      strength:'',
      selected:[]
    });
    setFields(values);
  }
  const AddSelectedDrugs = (i, event) =>
    {
      if(event === null){
        const values = [...fields];
        values[i]['drug']='';
        values[i]['form'] = '';
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['drug'] = value;
        values[i]['form'] = '';
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
      }
      
      //setSelectedLeaflets(arr);
    };

    const addSelectedForm = (i, event) =>
    {
      if(event === null){
        const values = [...fields];
        values[i]['form']='';
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['form'] = value;
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
      }
      
      //setSelectedLeaflets(arr);
    };
    const addSelectedStrength = (i, event) =>
    {
      if(event === null){
        const values = [...fields];
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['strength'] = value;
        var arr = values[i]['drug'].drugs.filter(item=>item.form===values[i]['form']&&item.strength===values[i]['strength']);
        values[i]['selected'] = arr;
        setFields(values);
      }
    };

  function handleAddedInputChange(i, event) {
    const values = [...fields];
    const { name, value } = event.target;
    values[i][name] = value;
    setFields(values);
  }

  function handleRemoveInput(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }

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
    setFields([]);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setError(false);
    dispatch(removeError());
  }
  const handleCloseInfo = () => {
    newDisease();
    setInfo(false);
    setValidated(false);
    setFields([]);
  };
  const [overviews, setOverviews] = React.useState([]);
  
  const handleInputChange = event => {
    const { name, value } = event.target;
    setDisease({ ...disease,  [name]: value});   
  };

  const loadDrugsOptions = (inputValue, callback) => {    
    DrugsSubstancesDataService.findBySubstance(inputValue)
        .then(response => {
            const result = response.data.data.map(x => makeOptions(x));          
           callback(result);      
        })
        .catch(e => {
          console.log(e);
        });
  };

  const loadOptions = (inputValue, callback) => {
    SymptomsDataService.findByTitle(inputValue)
      .then(response => {
          const result = response.data.data.map(x => makeOptions(x));          
          callback(result);
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };

  const loadDiseasesOptions = (inputValue, callback) => {
    diseasesDataService.findByTitle(inputValue)
      .then(response => {
          const result = response.data.data.map(x => makeOptions(x));          
          callback(result);
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
function makeOptions(field){
  if(field.drug === undefined){
    return { value: field, label: field.name };
  }else{
    return { value: field.id, label: field.drug.substance };
  }
  
} 
function setFieldsArray(drugs){
  var arr = drugs.map(item=>{
    return {drug: item.substance, uses:item.uses, form:item.form, strength:item.strength}
  });
const result = [];
const map = new Map();
for (const item of arr) {
    if(!map.has(item.drug+item.form+item.strength)){
        map.set(item.drug+item.form+item.strength, true);
        var arrNames = drugs.filter(x=>x.form===item.form&&x.strength===item.strength&&x.substance.name===item.drug.name);
        result.push({
          drug: item.drug, 
          uses:item.uses, 
          form:item.form, 
          strength:item.strength,
          selected:arrNames,
        });
    }
}
  setFields(result);
  
} 
  
  
  const handleSymptomsInputChange = event =>
    {
      const arr = event.map(item=>item.value.id);
      setSelectedSymptoms(arr);
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
  const retrieveDiseasesOverviews = (pageNumber  = 1) => {
    DiseaseOverviewsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          setOverviews(response.data.data); 
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }else{
          setOverviews(response.data.data);
          setNoData("No");
        }    
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
              function(event){setFieldsArray(row.drugs); setDisease(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){
                setFieldsArray(row.drugs);setSelectedDisease(row.disease_id); setDisease(row); setShow(true);setSelectedSymptoms(row.symptoms.map(item=>item.id));}}>
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
  var drugsArr = fields.map(item=>{
    return {selected:item.selected.map(x=>x.id), uses:item.uses}
  });
  var data = {
    disease_id: selectedDisease.id,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(selectedSymptoms),
  };
  DiseaseOverviewsDataService.create(data)
    .then((response) => {
      refreshList();
      handleClose();            
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const updateDisease = () => {
  var drugsArr = fields.map(item=>{
    return {selected:item.selected.map(x=>x.id), uses:item.uses}
  });
  var data = {
    id: disease.id,
    disease_id: selectedDisease.id===undefined?selectedDisease:selectedDisease.id,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(selectedSymptoms),
  };
  DiseaseOverviewsDataService.update(data.id, data)
    .then((resp) => {

      let values = [...overviews];
      values = values.map((item)=>{
        if(item.id === resp.data.data.id){
          return resp.data.data;
        }else{
          return item;
        }
      });
      setOverviews(values);
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
      //deleteItemFromState(id);
      if(overviews.length>1){
        retrieveDiseasesOverviews(page);
      }else if(page > 1){
        retrieveDiseasesOverviews(page-1);
      }else{
        retrieveDiseasesOverviews();
      }      
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
      <div className="mb-4"><h2>Ligos</h2></div>
      {overviews?(
      overviews.length===0 && noData===''?( 
        <div> <Spinner></Spinner> </div>         
      ):(  
        <div>
          
        <div className="d-flex justify-content-between">
        <div className="mb-3">
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-rate-1">Sukurti naują</Tooltip>}
          >
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
          </OverlayTrigger>
          
    </div>
          <div className="col-md-6">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ieškoti pagal pavadinimą"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Ieškoti
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
      { show && 
      <DiseaseCreateUpdate 
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
        AddSelectedDrugs={AddSelectedDrugs} 
        handleSymptomsInputChange={handleSymptomsInputChange} 
        handleDiseaseInputChange={handleDiseaseInputChange} 
        handleAddInput={handleAddInput}
        handleRemoveInput={handleRemoveInput}
        fields={fields}
        handleAddedInputChange={handleAddedInputChange}
        addSelectedForm={addSelectedForm}        
        addSelectedStrength={addSelectedStrength}
      ></DiseaseCreateUpdate> }

      { confirm && <DiseaseDelete 
        id={id} 
        name={"ligą"} 
        deleteItem={deleteItem} 
        handleCloseConfirm={handleCloseConfirm} 
        confirm={confirm}
      ></DiseaseDelete> }
      { info && <DiseaseInfo fields={fields} info = {info} disease={disease} handleCloseInfo={handleCloseInfo}></DiseaseInfo> }
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
        firstPageText="Pradžia"
        lastPageText="Pabaiga"
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