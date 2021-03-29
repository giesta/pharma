import React, { useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import DrugsDataService from "../../services/drugs/list.service";
import DrugsLeafletsDataService from "../../services/drugs/leaflets.serevice";
import DiseasesDataService from "../../services/diseases/list.service";
import DiseaseOverviewsDataService from "../../services/diseases/overviews.service";
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
    ATC:"",
    strength:"",
    form:"",
    package:"",
    package_description:"",
    registration:"",
  };

  const initialLeafletState = {  
    id: null,
    indication: "",
    contraindication: "",
    reaction: "",
    use: "",
    diseases: [],
    drug:initialDrugState
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
  { dataField: 'ATC',  
    text: 'ATC',  
    sort: true  },  
  { dataField: 'strength',  
    text: 'Strength',  
    sort: true },  
  {  
    dataField: 'form',  
    text: 'Form',  
    sort: true  
  }, {  
    dataField: 'package',  
    text: 'Package',  
    sort: true },
 {
    text: 'Actions',
    dataField: 'Actions',
    editable: false 
 }];

  const [drug, setDrug] = React.useState(initialDrugState);
  const [leaflet, setLeaflet] = React.useState(initialLeafletState);

  const [noData, setNoData] = React.useState('');
  const [error, setError] = React.useState(false);

  const [overviews, setOverviews] = React.useState([]);
  const [selectedOverviews, setSelectedOverviews] = React.useState([]); 

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
   
  const [validated, setValidated] = React.useState(false);

  const [searchTitle, setSearchTitle] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  const [selectRef, setSelectRef] = React.useState(null);
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    //retrieveDrugsLeaflets();
    //setLeaflet(initialLeafletState);
    setPage(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.stopPropagation();
    }else{
      if(leaflet.id===null||leaflet.id===undefined){
        saveLeaflet();        
      }else{
        handleInputChange(event); 
        updateLeaflet();
      } 
    }
    setValidated(true);       
  };

  const handleClose = () =>{
    newLeaflet();
    setShow(false);
    setValidated(false);
  };
  const handleCloseConfirm = () => setConfirm(false);
  const handleCloseInfo = () => {
    newLeaflet();
    setInfo(false);
  };
  const [drugs, setDrugs] = React.useState([]);
  const [leaflets, setLeaflets] = React.useState([]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLeaflet({ ...leaflet, [name]: value });
  };

  const handleSelectChange = event => {
    if(event===null){
      setLeaflet({
        drug:initialDrugState,
        diseases:leaflet.diseases,
        id:leaflet.id
      });
    }else{
      var selectedDrug = event.value;
      console.log(selectedDrug);
      setDrug({
        id: selectedDrug.id,
        name: selectedDrug.name,
        substance: selectedDrug.substance,
        indication: selectedDrug.indication,
        contraindication: selectedDrug.contraindication,
        reaction: selectedDrug.reaction,
        use: selectedDrug.use,
        diseases: selectedDrug.diseases,
      });
      setLeaflet({
        drug:selectedDrug,
        diseases:leaflet.diseases,
        id:leaflet.id
      });
    }    
  };

  const loadOptions = (inputValue, callback) => {
    DiseaseOverviewsDataService.findByName(inputValue)
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
  const loadDrugsOptions = (inputValue, callback) => {
    DrugsDataService.findBySubstance(inputValue)
      .then(response => {        
        console.log(response.data.data);
        const result = response.data.data.map(x => {
          return { value: x, label: x.substance }
        }
          );          
        callback(result);
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
  
  const handleOverviewsInputChange = event =>
    {
      const arr = event.map(item=>item.value);
      setSelectedOverviews(arr);
    };
  
  const retrieveDrugsLeaflets = (pageNumber = 1) => {
    DrugsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        console.log(response.data.data);
        const { current_page, per_page, total } = response.data.meta;      
        if(response.data.data.length !== 0){
          setDrugs(response.data.data);
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);     
        }else{
          setNoData("No");
        }
        //retrieveDrugs();     
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {  
        console.log(response.data.data);    
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data});    
        }else{
          setNoData("No");
        }    
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
  useEffect(retrieveDrugsLeaflets, []);

  const GetActionFormat = (row) =>{
    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDrug(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            
        </td>
    );
};

const deleteItemFromState = (id) => {
  const updatedItems = leaflets.filter(x=>x.id!==id)
  setLeaflets(updatedItems)
}
const saveLeaflet = () => {
  
  var data = {
    token: AuthService.getCurrentUser().access_token,
    indication: leaflet.indication,
    contraindication: leaflet.contraindication,
    reaction: leaflet.reaction,
    use: leaflet.use,
    diseases: JSON.stringify(selectedOverviews),
    drug_id: leaflet.drug.id
  };
  DrugsLeafletsDataService.create(data)
    .then((response) => {
      const { current_page, per_page, total } = response.data.meta;
      if(response.data.data.length !== 0){
        setDrugs(response.data.data);
        setPageSize(per_page);     
        setTotal(total); 
      }
      refreshList();
      handleClose();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
    console.log("-----Veikia saugojimas-----");
    console.log(leaflet);
};

const updateLeaflet = () => {
  
  var data = {
    id: leaflet.id,
    indication: leaflet.indication,
    contraindication: leaflet.contraindication,
    reaction: leaflet.reaction,
    use: leaflet.use,
    diseases: JSON.stringify(selectedOverviews),
    drug_id: leaflet.drug.id
  };
  DrugsLeafletsDataService.update(data.id, data)
    .then(response => {
      setLeaflet({
        id: response.data.data.id,
        indication: response.data.data.indication,
        contraindication: response.data.data.contraindication,
        reaction: response.data.data.reaction,
        use: response.data.data.use,
        diseases: response.data.data.diseases,
        drug:response.data.data.drug
      });
      handleClose();
      console.log(leaflet);
      const updatedItems = leaflets.filter(x=>x.id!==leaflet.id)
      updatedItems.push(response.data.data);
      setLeaflets(updatedItems);
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
    console.log("-----Veikia atnaujinimas-----");
  console.log(leaflet);
};

const deleteItem = (id) => {
  DrugsLeafletsDataService.remove(id)
    .then(() => {
      deleteItemFromState(id);
      handleCloseConfirm();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const newLeaflet = () => {
  setLeaflet(initialLeafletState);
};

const findByTitle = () => {
  DrugsDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        
          console.log(response.data.data);
          setDrugs(response.data.data);
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
      {drugs?(
      drugs.length === 0 && noData === ''?(        
        <Spinner></Spinner>
      ):( 
        <div>
          
          
        <div className="d-flex justify-content-between">
        <div className="mb-3">
          
          
    </div>
          <div className="col-md-6">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name, Substance or ATC"
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
      <div className="container">  {console.log(drugs)}
      <DrugsTable key={"drugs"} columns ={columns} drugs = {drugs} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></DrugsTable>

      { info &&<DrugInfo info = {info} drug = {drug} handleCloseInfo={handleCloseInfo}></DrugInfo> }  
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDrugsLeaflets(pageNumber)}
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