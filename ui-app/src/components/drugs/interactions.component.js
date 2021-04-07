import React, { useEffect } from 'react';

import DrugsSubstancesDataService from "../../services/drugs/substances.service";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";


export default function Interactions() {
    const [loading, setLoading] = React.useState(false);

    const initialFieldsArray=[{
        ATC: '',
    }]

    const [fields, setFields] = React.useState(initialFieldsArray);
    const [valuesOfId, setValuesOfId] = React.useState([]);
    const [interactions, setInteractions] = React.useState([]);
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

     const getInter = (values) =>{
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
            
        })
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
            })
            //console.log(value);
            values.push(value); 
            //setValuesOfId(values);
            
          }
          console.log(values);
          getInter(values);
      }


  return (
    <div>
      
        <div>      
      <div className="container">
          

      {fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        
                        <h4>Drug</h4>    
                        <label>Name</label>  
                        <AsyncSelect
                            name="drugs"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            loadOptions={loadDrugsOptions}
                            onChange={e=>AddSelectedDrugs(idx, e)}
                     />
                    
                    
                   {idx>0?(<div className="row">
  
  <div className="container text-right"><a type="button" className="link_danger" onClick={()=>handleRemoveInput(idx)} >
                        <BsXCircle></BsXCircle>
                    </a></div></div>):('')} 

                    
                    </div>
                    )
                })}    
                
                <div className="col-auto mr-auto mt-2"><a type="button" className="link_success" size="sm" onClick={handleAddInput} >
                Add Drug <BsPlusCircle></BsPlusCircle>
          </a></div>  
      
  </div>
  </div>{console.log(loading)}
  <button type="button" disabled={loading} className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){setLoading(true);getInteraction();}}>
              {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )} Check Interactions
  </button>
  {interactions.length > 0?(
  <div className="border border-secondary p-3 mt-2">{console.log(interactions)}
      {interactions[0].fullInteractionType!==undefined?(interactions.map(item=>{
          console.log(item.fullInteractionType);
         return item.fullInteractionType.map(item=>{
              console.log(item.interactionPair)
             return item.interactionPair.map(item=>{
                  console.log(item.description);
                  return (<p>{item.description}</p>)
              })
          })
      })):(interactions)}
  </div>
  ):('')}
  </div>
  
    
    
  );
}