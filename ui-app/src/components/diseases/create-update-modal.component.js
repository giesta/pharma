import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";
import { Link } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";

export default function CreateModal(props) {
    function makeOptions(field){

        var arr = field.drug.drugs.map(item=>item.form);
        arr = [...new Set(arr)];
        return arr.map(item=>{
            return { value: item, label: item}
        }

        )
        
      } 
      function makeOptionsStrength(field){
        var arrStrength = field.drug.drugs.filter(item=>item.form===field.form);
        var strengths = arrStrength.map(item=>item.strength);
        arr = [...new Set(strengths)];
        var arr = arr.map(item=>{
            return { value: item, label: item}
        });
        
        return arr;
        
      } 
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Disease info {props.disease.id}</Modal.Title>
            </Modal.Header>
            <Form validated={props.validated} onSubmit={props.handleSubmit}>
                <Modal.Body>  
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <AsyncSelect
                            ref={props.setSelectRef}
                            name="disease"
                            /*options={props.options.map(item=>{
                                return { value: item.id, label: item.name };
                            })}*/
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            loadOptions={props.loadDiseasesOptions}
                            onChange={props.handleDiseaseInputChange}
                            defaultValue={props.disease.disease_id!==null?({value: props.disease.disease_id, label: props.disease.name}):('')}
                        />
                        <Form.Control
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            style={{
                            opacity: 0,
                            width: "100%",
                            height: 0,
                            position: "absolute"
                            }}
                            required
                            onFocus={() => props.selectRef.focus()}
                            value = {props.disease.disease_id || ""}
                            onChange={props.handleDiseaseInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Name is a required field.
                        </Form.Control.Feedback >
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={props.disease.description} onChange={props.handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Description is a required field.
                        </Form.Control.Feedback >
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>  
                    <Form.Group controlId="diagnosis">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.diagnosis} onChange={props.handleInputChange} name="diagnosis"/>
                    </Form.Group> 
                    <Form.Group controlId="symptoms"> 
                    <Form.Label>Symptoms</Form.Label>
                    <AsyncSelect
                        name="symptoms"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isClearable="true"
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={props.loadOptions}
                        onChange={props.handleSymptomsInputChange}
                        defaultValue={props.disease.symptoms!==null&&props.disease.symptoms!==undefined?(props.disease.symptoms.map(item=>
                        ({value: item, label: item.name})
                    
                        )):('')}
                     /> 
                     </Form.Group>
                     <Form.Group controlId="prevention">
                        <Form.Label>Prevention</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.prevention} onChange={props.handleInputChange} name="prevention"/>
                    </Form.Group>                                       
                {
                   
                }  
                {props.fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        <Form.Group controlId="drugs">
                        <h4>Drug</h4>    
                        <Form.Label>Name</Form.Label>  
                        <AsyncSelect
                            name="drugs"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            loadOptions={props.loadDrugsOptions}
                            value={field.drug!==''?({value: field.drug, label: field.drug.name}):('')}
                            onChange={e=>props.AddSelectedDrugs(idx, e)}
                            defaultValue={field.drug!==''?({value: field.drug, label: field.drug.name}):('')}
                     />
                    </Form.Group>
                    {field.drug !== ''?(
                        <Form.Group controlId="form">
                        <Form.Label>Form</Form.Label>     
                        <Select
                            name="form"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            value={field.form!==''?({value: field.form, label: field.form}):('')}
                            onChange={(e)=>props.addSelectedForm(idx, e)}
                            options={field.drug !== ''?(makeOptions(field)):('')}
                            defaultValue={field.form!==''?({value: field.form, label: field.form}):('')}/>
                    </Form.Group>
                    ):('')
                        
                     
                    }
                    {field.form !== ''?(
                        <Form.Group controlId="strength">
                        <Form.Label>Strength</Form.Label>     
                        <Select
                            name="form"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            value={field.strength!==''?({value: field.strength, label: field.strength}):('')}
                            onChange={(e)=>props.addSelectedStrength(idx, e)}
                            options={field.form !== ''?(makeOptionsStrength(field)):('')}
                            defaultValue={field.strength!==''?({value: field.strength, label: field.strength}):('')}/>
                    </Form.Group>
                    ):('')                     
                    }
                    <div>
                    {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item)=>
                              item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                              <Badge pill variant="warning">{item.name}</Badge>
                                  :<Badge pill variant="success">{item.name}</Badge>
                          )):('')
                          }
                      </div>
                      {field.strength !== ''?(
                    <Form.Group controlId={`${field}-${idx}`}>
                        <Form.Label>Uses</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={field.uses} onChange={(e)=>props.handleAddedInputChange(idx, e)}  name="uses"/>
                    </Form.Group>):('')}
                    <div class="row">
  
  <div className="container text-right"><a type="button" className="link_danger" onClick={()=>props.handleRemoveInput(idx)} >
                        <BsXCircle></BsXCircle>
                    </a></div>
</div>
                    
                    </div>
                    )
                })}    
                
                <div class="col-auto mr-auto mt-2"><a type="button" className="link_success" size="sm" onClick={props.handleAddInput} >
                Add Drug <BsPlusCircle></BsPlusCircle>
          </a></div>                      
                     
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                        {props.disease.id===null?(<Button type="submit" variant="primary">
                            Create Disease
                    </Button>):(<Button type="submit" variant="primary">
                        Update Disease
                    </Button>)}          
                </Modal.Footer>
            </Form>
      </Modal>

    );
}