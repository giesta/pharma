import React, { useEffect } from 'react';

import DrugsSubstancesDataService from "../../services/drugs/substances.service";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";


export default function Interactions() {

    const initialFieldsArray=[{
        atc: '',
    }]

    const [fields, setFields] = React.useState(initialFieldsArray);

    function handleAddInput() {
        const values = [...fields];
        values.push({
          atc: '',
        });
        setFields(values);
      }
      const AddSelectedDrugs = (i, event) =>
        {
          if(event === null){
            const values = [...fields];
            values[i]['atc']='';
            setFields(values);
          }else{
            const value = event.value;
            const values = [...fields];
            values[i]['atc']= value;
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


  return (
    <div>
      
        <div>      
      <div className="container">
          

      {fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        <div controlId="drugs">
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
                    </div>
                    
                   {idx>0?(<div className="row">
  
  <div className="container text-right"><a type="button" className="link_danger" onClick={()=>handleRemoveInput(idx)} >
                        <BsXCircle></BsXCircle>
                    </a></div></div>):('')} 

                    
                    </div>
                    )
                })}    
                
                <div class="col-auto mr-auto mt-2"><a type="button" className="link_success" size="sm" onClick={handleAddInput} >
                Add Drug <BsPlusCircle></BsPlusCircle>
          </a></div>  
      
  </div>
  </div></div>
    
    
  );
}