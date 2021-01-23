import React, { useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import DrugsDataService from "../../services/drugs/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import DrugDelete from "../delete-modal.component";
import DrugInfo from "./info-modal.component";
import DrugCreateUpdate from "./create-update-modal.component";
import DrugsTable from "./table.component";
import Spinner from "../layout/spinner.component";
import ErrorBoundary from "../layout/error.component";
import Pagination from "react-js-pagination";
import { BsPen, BsTrash, BsInfoCircle, BsPlus } from "react-icons/bs";

export default function DrugsList() {

  const initialDrugState = {  
    id: null,  
    name: "",
    substance: "",
    indication: "",
    contraindication: "",
    reaction: "",
    use: "",
    diseases: []
  };

  const columns = [{  
    dataField: 'no',  
    text: 'No' },  
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
 }];

  const [drug, setDrug] = React.useState(initialDrugState);
  const [noData, setNoData] = React.useState('');
  const [error, setError] = React.useState(false);
  const [diseases, setDiseases] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [selectedDiseases, setSelectedDiseases] = React.useState([]);  
  const [validated, setValidated] = React.useState(false);

  const [searchTitle, setSearchTitle] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveDrugs();
    setDrug(initialDrugState);
    setPage(1);
  };

  const AddSelectedDiseases = event => {
    const selectedDiseases = [...event.target.selectedOptions].map(o => o.value)
    setSelectedDiseases(selectedDiseases);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.stopPropagation();
    }else{
      if(drug.id===null){
        saveDrug();
      }else{
        handleInputChange(event); 
        updateDrug();
      } 
    }
    setValidated(true);       
  };

  const handleClose = () =>{
    newDrug();
    setShow(false);
    setValidated(false);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newDrug();
    setInfo(false);
  };
  const [drugs, setDrugs] = React.useState({
    data: [],
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setDrug({ ...drug, [name]: value });
  };
  
  const retrieveDrugs = (pageNumber = 1) => {
    DrugsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        const { current_page, per_page, total } = response.data.meta;      
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data});
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
  useEffect(retrieveDrugs, []);
  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
      .then(response => {
        if(response.data.data.length !== 0){
          setDiseases({...diseases, data: response.data.data});
        }       
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };

  const GetActionFormat = (row) =>{
    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDrug(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ setDrug(row); setShow(true)}}>
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
  const updatedItems = drugs.data.filter(x=>x.id!==id)
  setDrugs({ data: updatedItems })
}
const saveDrug = () => {
  var data = {
    token: AuthService.getCurrentUser().access_token,
    name: drug.name,
    substance: drug.substance,
    indication: drug.indication,
    contraindication: drug.contraindication,
    reaction: drug.reaction,
    use: drug.use,
    diseases: JSON.stringify(selectedDiseases)
  };
  DrugsDataService.create(data)
    .then(() => {
      refreshList();
      handleClose();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const updateDrug = () => {
  var data = {
    id: drug.id,
    name: drug.name,
    substance: drug.substance,
    indication: drug.indication,
    contraindication: drug.contraindication,
    reaction: drug.reaction,
    use: drug.use,
    diseases: JSON.stringify(selectedDiseases)
  };
  DrugsDataService.update(data.id, data)
    .then(response => {
      setDrug({
        id: response.data.data.id,
        name: response.data.data.name,
        substance: response.data.data.substance,
        indication: response.data.data.indication,
        contraindication: response.data.data.contraindication,
        reaction: response.data.data.reaction,
        use: response.data.data.use,
        diseases: response.data.data.diseases,
      });
      handleClose();
      const updatedItems = drugs.data.filter(x=>x.id!==drug.id)
      updatedItems.push(response.data.data);
      setDrugs({...drugs, data: updatedItems});
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const deleteItem = (id) => {
  DrugsDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const newDrug = () => {
  setDrug(initialDrugState);
};

const findByTitle = () => {
  DrugsDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data}); 
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
      {drugs?(
      drugs.data.length === 0 && noData === ''?(        
        <Spinner></Spinner>
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
      <DrugsTable key={"drugs"} columns ={columns} drugs = {drugs} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></DrugsTable>

      { show && <DrugCreateUpdate show ={show} handleClose={handleClose} drug={drug} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} diseases={diseases} AddSelectedDiseases={AddSelectedDiseases}></DrugCreateUpdate> }

      { confirm &&<DrugDelete id={id} name={"Drug"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm}></DrugDelete> }

      { info &&<DrugInfo info = {info} drug = {drug} handleCloseInfo={handleCloseInfo}></DrugInfo> }  
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDrugs(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
         
  </div> </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>
    
    
  );
}