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
  const [selectRef, setSelectRef] = React.useState(null);
  
  const [selectedDisease, setSelectedDisease] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [symptoms, setSymptoms] = React.useState([]);
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
        console.log(fields);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['drug'] = value;
        values[i]['form'] = '';
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
        console.log(fields);
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
        console.log(fields);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['form'] = value;
        values[i]['strength']='';
        values[i]['selected']=[];
        setFields(values);
        console.log(fields);
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
        console.log(fields);
      }else{
        const value = event.value;
        const values = [...fields];
        values[i]['strength'] = value;
        var arr = values[i]['drug'].drugs.filter(item=>item.form===values[i]['form']&&item.strength===values[i]['strength']);
        values[i]['selected'] = arr;
        //console.log(arr);
        setFields(values);
        console.log(fields);
      }
      
      //setSelectedLeaflets(arr);
    };

  function handleAddedInputChange(i, event) {
    console.log(event);
    const values = [...fields];
    const { name, value } = event.target;
    values[i][name] = value;
    setFields(values);
    console.log(fields);
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
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newDisease();
    setInfo(false);
    setValidated(false);
    setFields([]);
  };
  const [diseases, setDiseases] = React.useState({
    data: [],
  });
  const [overviews, setOverviews] = React.useState([]);
  
  const handleInputChange = event => {
    const { name, value } = event.target;
    setDisease({ ...disease,  [name]: value});   
  };

  const loadDrugsOptions = (inputValue, callback) => {    
    DrugsSubstancesDataService.findBySubstance(inputValue)
        .then(response => {
            console.log(response.data.data);
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
          console.log(response.data.data);
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
          console.log(response.data.data);
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
        console.log(drugs);   // set any value to Map
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
      console.log(event);
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
                console.log(row.disease_id);
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
    return {selected:item.selected, uses:item.uses}
  });
  var data = {
    disease_id: selectedDisease.id,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(selectedSymptoms),
  };
  console.log(data);
  DiseaseOverviewsDataService.create(data)
    .then((response) => {
      console.log(response.data.data);
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
    return {selected:item.selected, uses:item.uses}
  });
  var data = {
    id: disease.id,
    disease_id: selectedDisease.id===undefined?selectedDisease:selectedDisease.id,
    description: disease.description,
    diagnosis: disease.diagnosis,
    prevention: disease.prevention,
    drugs: JSON.stringify(drugsArr),
    symptoms: JSON.stringify(selectedSymptoms),
  };console.log(data);
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
      //deleteItemFromState(id);
      if(overviews.length>1){
        console.log(1)
        retrieveDiseasesOverviews(page);
      }else if(page > 1){
        console.log(2)
        retrieveDiseasesOverviews(page-1);
      }else{
        console.log(2)
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
        name={"Disease"} 
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