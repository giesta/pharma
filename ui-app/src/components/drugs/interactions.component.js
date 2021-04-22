import React, { useEffect } from 'react';

import DrugsSubstancesDataService from "../../services/drugs/substances.service";
import { Alert} from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";
import ErrorBoundary from "../layout/error.component";

export default function Interactions() {
    const [loading, setLoading] = React.useState(false);

    const initialFieldsArray=[{
        ATC: '',
    }]

    const [fields, setFields] = React.useState(initialFieldsArray);
    const [valuesOfId, setValuesOfId] = React.useState([]);
    const [interactions, setInteractions] = React.useState([]);
    const [error, setError] = React.useState(false);
    function handleAddInput() {
        const values = [...fields];
        values.push({
          ATC: '',
        });
        setFields(values);
      }
      const AddSelectedDrugs = (i, event) =>
        {
          if(event === null){
            const values = [...fields];
            values[i]['ATC']='';
            setFields(values);
          }else{
            const value = event.value;
            const values = [...fields];
            values[i]['ATC']= value;
            setFields(values);
          }
        };

        function handleRemoveInput(i) {
            const values = [...fields];
            values.splice(i, 1);
            setFields(values);
          }

    const loadDrugsOptions = (inputValue, callback) => {    
        DrugsSubstancesDataService.findBySubstance(inputValue)
            .then(response => {
                const result = response.data.data.map(x => {
                    return {value:x.ATC, label:x.name};
                });          
               callback(result);      
            })
            .catch(e => {
              console.log(e);
            });
      };

     const showInteraction = (values) =>{
        var query = "";
        for(const value of values){
          query += value+"+";
        }
        DrugsSubstancesDataService.getInteractions(query).then(response=>{
            if(response.data.fullInteractionTypeGroup!==undefined){
                setInteractions(response.data.fullInteractionTypeGroup);
            }else{
                setInteractions("Vaistų tarpusavio sąveika nerasta, bet tai nereiškia, kad jos nėra.");
            }
            
        }).catch(e => {
          setError(true);
          console.log(e);
        });
        setLoading(false);
     }

      const getInteraction = async () =>{
          var values = [];
          for (const item of fields){
            const value = await DrugsSubstancesDataService.getRXUI(item.ATC)            
            .then(response=>{                
                if(response.data.idGroup.rxnormId!==undefined){  
                   return response.data.idGroup.rxnormId[0];
                }
            }).catch(e => {
              setError(true);
              console.log(e);
            });
            values.push(value);             
          }
          showInteraction(values);
      }


  return (
    <div>
      {error?<ErrorBoundary/>:''}
        <div>      
      <div className="container">
        <div className="mb-4">
          <h4>Sąveikų tarp vaistų patikrinimas</h4>
        </div>
          

      {fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        
                        <h4>Vaistas</h4>    
                        <label>Veiklioji medžiaga</label>  
                        <AsyncSelect
                            name="drugs"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            
                            loadOptions={loadDrugsOptions}
                            placeholder={"Pasirinkti ..."}
                            loadingMessage={() => "Ieškoma ..."}
                            noOptionsMessage={() => "Nerasta"}
                            onChange={e=>AddSelectedDrugs(idx, e)}
                     />
                    
                    
                   {idx>0?(<div className="row">
  
  <div className="container text-right mt-2"><a type="button" className="link_danger" onClick={()=>handleRemoveInput(idx)} >
                        Šalinti <BsXCircle></BsXCircle>
                    </a></div></div>):('')} 

                    
                    </div>
                    )
                })}    
                
                <div className="col-auto mr-auto mt-2 mb-2"><a type="button" className="link_success" size="sm" onClick={handleAddInput} >
                Įtraukti vaistą <BsPlusCircle></BsPlusCircle>
          </a></div>  
      
  
  
  <button type="button" disabled={loading} className="btn btn-outline-dark btn-sm ts-buttom mt-2" size="sm" onClick={
            function(event){setLoading(true);getInteraction();}}>
              {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )} Tikrinti sąveiką
  </button>
  {interactions.length > 0?(
  <div className="border border-secondary p-3 mt-2">
    <h6>Gauti duomenys apie vaistų sąveiką (anglų kalba):</h6>
      {interactions[0].fullInteractionType!==undefined?(interactions.map(item=>{
         return item.fullInteractionType.map(item=>{
             return item.interactionPair.map((item, idx)=>{
                  if(item.severity==="high"){
                      return (<Alert key={idx} variant="danger">{item.description}</Alert>)
                  }else{
                      return (<div><p key={idx}><strong>{"Interaction between "+item.interactionConcept[0].minConceptItem.name+" and "+item.interactionConcept[1].minConceptItem.name}</strong></p>
                      <p key={idx}>{item.description}</p></div>)
                  }
                  
              })
          })
      })):(interactions)}
  </div>
  ):('')}
  </div></div></div>
  
    
    
  );
}