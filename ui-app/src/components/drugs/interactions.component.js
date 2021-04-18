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
            console.log(fields);
          }
          
          //setSelectedLeaflets(arr);
        };

        function handleRemoveInput(i) {
            const values = [...fields];
            console.log(i);
            console.log(values);
            values.splice(i, 1);
            setFields(values);
          }

    const loadDrugsOptions = (inputValue, callback) => {    
        DrugsSubstancesDataService.findBySubstance(inputValue)
            .then(response => {
                console.log(response.data.data);
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
        console.log(values);
        for(const value of values){
          query += value+"+";
        }
        console.log(query);
        DrugsSubstancesDataService.getInteractions(query).then(response=>{
            console.log(response.data);
            if(response.data.fullInteractionTypeGroup!==undefined){
                setInteractions(response.data.fullInteractionTypeGroup);
            }else{
                setInteractions("Not Found");
            }
            
        }).catch(e => {
          setError(true);
          console.log(e);
        });
        setLoading(false);
     }

      const getInteraction = async () =>{
          console.log(fields);
          var values = [];
          for (const item of fields){
            console.log(item.ATC);
            //const values = [...valuesOfId];
            const value = await DrugsSubstancesDataService.getRXUI(item.ATC)
            
            .then(response=>{                
                if(response.data.idGroup.rxnormId!==undefined){
                   console.log(response.data.idGroup.rxnormId);   
                   return response.data.idGroup.rxnormId[0];
                }
            }).catch(e => {
              setError(true);
              console.log(e);
            });
            //console.log(value);
            values.push(value); 
            //setValuesOfId(values);
            
          }
          console.log(values);
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
                            placeholder={"Pasirinkti ..."}
                            loadOptions={loadDrugsOptions}
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
  <div className="border border-secondary p-3 mt-2">{console.log(interactions)}
      {interactions[0].fullInteractionType!==undefined?(interactions.map(item=>{
          console.log(item.fullInteractionType);
         return item.fullInteractionType.map(item=>{
              console.log(item.interactionPair)
             return item.interactionPair.map((item, idx)=>{
                  console.log(item.description);
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