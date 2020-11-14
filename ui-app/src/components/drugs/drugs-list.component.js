import React, { useCallback, useEffect } from 'react';
import AuthService from "../../services/auth.service"; 
import DrugsDataService from "../../services/drugs/list.service";
import DiseasesDataService from "../../services/diseases/list.service";
import DrugDelete from "../delete-modal.component";
import DrugInfo from "./info-modal.component";
import DrugCreateUpdate from "./create-update-modal.component";
import DrugsTable from "./table.component";
import Spinner from "../layout/spinner.component";
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
  const [diseases, setDiseases] = React.useState({
    data: [],
  });

  const [show, setShow] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [selectedDiseases, setSelectedDiseases] = React.useState([]);
  
  const [validated, setValidated] = React.useState(false);

  const AddSelectedDiseases = event => {
    const selectedDiseases = [...event.target.selectedOptions].map(o => o.value)
    setSelectedDiseases(selectedDiseases);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
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
  useEffect(()=>{
        retrieveDrugs();
        
  }, []);
  const retrieveDrugs = () => {
    DrugsDataService.getAll()
      .then(response => {        
        if(response.data.data.length !== 0){
          setDrugs({...drugs, data: response.data.data});          
        }  
        retrieveDiseases();     
      })
      .catch(e => {
        console.log(e);
      });
  };
  const retrieveDiseases = () => {
    DiseasesDataService.getAll()
      .then(response => {
        if(response.data.data.length !== 0){
          setDiseases({...diseases, data: response.data.data});
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
});

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
    .then(response => {
      setDrug({
        name: response.data.name,
        substance: response.data.substance,
        indication: response.data.indication,
        contraindication: response.data.contraindication,
        reaction: response.data.reaction,
        use: response.data.use,
        diseases: response.data.diseases,
      });
      handleClose();
      drugs.data.push(response.data.data);
      setDrugs({...drugs, data: drugs.data});
    })
    .catch(e => {
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
      console.log(e);
    });
};

const newDrug = () => {
  setDrug(initialDrugState);
};


  return (
    <div><div className="mb-3">
    <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setShow(true)}}>
              <BsPlus></BsPlus>
          </button>
    </div>
      {drugs?(
      drugs.data.length===0?(        
        <Spinner></Spinner>
      ):(        
      <div className="container">  
      <DrugsTable columns ={columns} drugs = {drugs} GetActionFormat={GetActionFormat}></DrugsTable>

      { show && <DrugCreateUpdate show ={show} handleClose={handleClose} drug={drug} validated={validated} handleSubmit={handleSubmit} handleInputChange={handleInputChange} diseases={diseases} AddSelectedDiseases={AddSelectedDiseases}></DrugCreateUpdate> }

      { confirm &&<DrugDelete id={id} name={"Drug"} deleteItem={deleteItem} handleCloseConfirm={handleCloseConfirm} confirm={confirm}></DrugDelete> }

      { info &&<DrugInfo info = {info} drug = {drug} handleCloseInfo={handleCloseInfo}></DrugInfo> }
  </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>
    
    
  );
}