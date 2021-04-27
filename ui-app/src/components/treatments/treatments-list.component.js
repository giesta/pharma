import React, { useEffect } from 'react';
import TreatmentsDataService from "../../services/treatments/list.service";
import DiagramsDataService from "../../services/diagrams/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import DiseaseOverviewsDataService from "../../services/diseases/overviews.service";
import TreatmentTable from "./table.component";
import TreatmentDelete from "../delete-modal.component";
import TreatmentCreateUpdate from "./create-update-modal.component";
import TreatmentInfo from "./info-modal.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus, BsEye } from "react-icons/bs";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import ErrorBoundary from "../layout/error.component";

export default function TreatmentList() {  
  const columns = [{  
      dataField: '',  
      text: 'Nr' },  
    {  
      dataField: 'title',  
      text: 'Pavadinimas',  
      sort:true}, {  
      dataField: 'description',  
      text: 'Aprašymas',  
      sort: true  }, {  
      dataField: 'disease',  
      text: 'Liga',  
      sort: true  }, {  
      dataField: 'public',  
      text: 'Viešas',  
      sort: false  },   
      {
      text: 'Veiksmai',
      dataField: 'Actions',
      editable: false 
    }
  ];
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [url, setUrl] = React.useState(null);
  const [noData, setNoData] = React.useState('');
  const [error, setError] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);

  const [overviews] = React.useState([]);
  const [selectedDiagram, setSelectedDiagram] = React.useState(null); 
  const [diagramsOptions, setDiagramsOptions] = React.useState([]); 
  
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const [searchTitle, setSearchTitle] = React.useState("");

  const [validated, setValidated] = React.useState(false);

  const [selectRef, setSelectRef] = React.useState(null);
  const [imageRef, setImageRef] = React.useState(null);

  const [fields, setFields] = React.useState([]);
  const [isWriting, setIsWriting] = React.useState(false);

  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    diagram:null,
    public: 0,
    drugs:[],
    disease: null
  };
  const [treatment, setTreatment] = React.useState(initialTreatmentState);

  useEffect(() => {
    if (isWriting) {
      setIsWriting(false);
      setTreatment({
        ...treatment,
        diagram: selectedDiagram,
      }      
      );
      setError(false);
    }
  }, [isWriting, selectedDiagram]);

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
        var arr = treatment.disease.drugs.filter(item=>item.form===values[i]['form']&&item.strength===values[i]['strength']);
        values[i]['selected'] = arr;
        setFields(values);
      }
    };

    const addSelectedDiagram = (event) =>
    {
      setIsWriting(true);
      if(event === null){
        setSelectedDiagram(null);
      }else{
        const value = event.value;
        setSelectedDiagram(value);
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
    if(treatment.diagram===null&&url===null&&treatment.algorithm===''){
      setError(true);
      event.stopPropagation();
    }
    else if (form.checkValidity() === false) {      
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
    setUrl(null);
    setFields([]);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newTreatment();
    setInfo(false);
    setFields([]);
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
        setError(false);
    }  
    setTreatment({ ...treatment, [name]: value });
  };
  const removeImageFile = event =>{
    setSelectedFile(null);
    setUrl(null);
    setTreatment({
      ...treatment,
      algorithm: '',
    }
    );
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
          setTreatments({...Treatments, data: response.data.data});
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
  
  function getElements(diagram){
    var arr = diagram.nodes.concat(diagram.edges);
    var items = arr.map((el)=>{
      if(el.source === undefined){
        var item = {id:el.item_id, data:{label:el.label, style:{backgroundColor:el.background}}, style:{backgroundColor:el.background}, type:el.type, position:{x:parseInt(el.x), y:parseInt(el.y)}};
        return item;
      }else{
        var itemVal = {id:el.item_id, data:{label:el.label, style:{stroke:el.stroke}, animated:el.animated===1?true:false}, animated:el.animated===1?true:false, arrowHeadType:el.arrow, label:el.label, style:{stroke:el.stroke}, type:el.type, source:el.source, target:el.target};
        return itemVal;
      }      
  });
return items;
}

  const GetActionFormat = (row) =>{    
    return (
        <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setFieldsArray(row.drugs); setTreatment(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <a type="button" href={"/treatments/"+row.id} className="btn btn-outline-secondary btn-sm ml-2 ts-buttom" size="sm">
                <BsEye/>
            </a>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setFieldsArray(row.drugs);setTreatment(row);
                
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

const loadOptions = (inputValue, callback) => {
  DiseaseOverviewsDataService.findByName(inputValue)
    .then(response => {
      const result = response.data.data.map(x => 
        {
          return { value: x, label: x.name }
        }
      );          
      callback(result);
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};


const getDiagramsOptions = () => {
  DiagramsDataService.getAll()
    .then(response => {      
      if(response.data.data.length !== 0){  
        const result =  response.data.data.map(x=>
          {
            return { value: x, label: x.name }
          }
        ) 
        setDiagramsOptions(result);      
      }      
    })
    .catch(e => {
      console.log(e);
      setError(true);
    });
};
useEffect(getDiagramsOptions,[]);

const handleOverviewsInputChange = event =>
{
  setFields([]);
  if(event===null){
    setTreatment({
      ...treatment,
      disease: null
    });
    
  }else{
    var selected = event.value;
    setTreatment({
      ...treatment,
      id: treatment.id,
      public: treatment.public,
      disease: selected
    });
    
  }
};

const saveTreatment = () => {
  var drugsArr = fields.map(item=>item.selected);
  var newArr = [];
newArr = [].concat(...drugsArr);

drugsArr = newArr.map(item=>{
  return {id: item.id, uses:item.uses}
});
    const data = new FormData();
    data.append('Content-Type','multipart/formdata');
    if(selectedFile!==null){
        data.append("algorithm", selectedFile);        
    }else{
      data.append("algorithm", '');
    } 
    data.append("title", treatment.title);
    data.append("description", treatment.description);
    data.append("overview_id", treatment.disease.id);
    data.append("public", treatment.public);
    data.append("uses", treatment.uses);
    data.append("drugs", JSON.stringify(drugsArr));
    if(treatment.diagram!== null){
      data.append("diagram_id", treatment.diagram.id);
    }
TreatmentsDataService.create(data)
    .then((response) => {
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
  var drugsArr = fields.map(item=>item.selected);
  var newArr = [];
  newArr = [].concat(...drugsArr);
  drugsArr = newArr.map(item=>{
    return {id: item.id, uses:item.uses}
  });
  const data = new FormData();
  data.append('Content-Type','multipart/formdata');
  data.append('_method', 'PUT');
  if(selectedFile!==null){
      data.append("algorithm", selectedFile);        
  }else{
    data.append("algorithm", treatment.algorithm);
  }
  data.set("title", treatment.title);
  data.set("description", treatment.description);
  data.set("public", treatment.public);
  data.set("overview_id", treatment.disease.id);
  data.append("uses", treatment.uses);
  data.append("drugs", JSON.stringify(drugsArr));
  if(treatment.diagram!== null){
    data.append("diagram_id", treatment.diagram.id);
  }else{
    data.append("diagram_id", null);
  }
  
  
  TreatmentsDataService.update(treatment.id, data)
    .then(response => {
      setFields([]);
      setTreatment({
        title: response.data.data.title,
        description: response.data.data.description,
        algorithm: response.data.data.algorithm,
        public: response.data.data.public,
        disease: response.data.data.disease,
      });
      setUrl(null);
      setSelectedDiagram(null);
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
      if(Treatments.data.length>1){
        retrieveTreatments(page);
      }else if(page > 1){
        retrieveTreatments(page - 1);
      }
      else{
        retrieveTreatments();
      }      
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
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

  return (
    <div>
      <div className="mb-2"><h5>Gydymo algoritmai</h5></div>
      
      {Treatments?(
      Treatments.data.length === 0 && noData === ''?(        
        <Spinner></Spinner>
      ):(   
        <div>
          {error?<ErrorBoundary/>:''}
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
      
      <>
  <TreatmentTable 
    columns ={columns} 
    Treatments={Treatments} 
    GetActionFormat={GetActionFormat} 
    rowNumber={(page*5-5)}
  >    
  </TreatmentTable>

  { show&&
  <TreatmentCreateUpdate 
    selectRef = {selectRef} 
    setSelectRef = {setSelectRef} 
    loadOptions={loadOptions} 
    show ={show} 
    handleClose={handleClose} 
    treatment={treatment} 
    validated={validated} 
    handleSubmit={handleSubmit} 
    handleInputChange={handleInputChange} 
    handleChecked={handleChecked} 
    diseases={overviews} 
    url={url} 
    handleOverviewsInputChange={handleOverviewsInputChange}
    fields={fields}
    handleAddedInputChange={handleAddedInputChange}
    addSelectedForm={addSelectedForm}        
    addSelectedStrength={addSelectedStrength}
    handleAddInput={handleAddInput}
    handleRemoveInput={handleRemoveInput}
    AddSelectedDrugs={AddSelectedDrugs}
    diagramsOptions={diagramsOptions}
    addSelectedDiagram={addSelectedDiagram}
    getElements={getElements}
    removeImageFile={removeImageFile}
    imageRef={setImageRef}
    error={error}
  >
    </TreatmentCreateUpdate>}
      
  {confirm&&< TreatmentDelete id={id} name={"gydymą"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm} ></ TreatmentDelete>}

  {info&&<TreatmentInfo 
    fields = {fields} 
    info = {info}  
    treatment={treatment} 
    handleCloseInfo={handleCloseInfo} 
    getElements={getElements}
  >
  </TreatmentInfo>}
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
        firstPageText="Pradžia"
        lastPageText="Pabaiga"
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