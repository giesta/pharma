import React from 'react';

import { Modal, Button, Form, Image, Badge } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";
import ReactFlow, {
    Controls,
    Background,
    ReactFlowProvider,
  } from 'react-flow-renderer'; 

export default function CreateModal(props) {
    const onLoad = (reactFlowInstance) => {
        console.log('flow loaded:', reactFlowInstance);
        reactFlowInstance.fitView({ padding: 0.8, includeHiddenNodes: true });
      };
 
    function makeOptionsForm(field, selectedDrug){
        //console.log(field);
        console.log(field);
        var arr = field.drugs.filter(item=>item.substance.name===selectedDrug.drug.name);
        const result = [];
        const map = new Map();
        for (const item of arr) {
            if(!map.has(item.form)){
                map.set(item.form, true); 
                //console.log(drugs);   // set any value to Map
                result.push({
                value: item.form, 
                label:item.form,
                });
            }
}
        //console.log(arr);
        return result;        
      } 
      function makeOptionsStrength(field, selectedDrug){
        //console.log(field);
        //console.log(selectedDrug);
        var arr = field.drugs.filter(item=>item.substance.name===selectedDrug.drug.name&&item.form===selectedDrug.form);
        const result = [];
        const map = new Map();
        for (const item of arr) {
            if(!map.has(item.strength)){
                map.set(item.strength, true); 
                //console.log(drugs);   // set any value to Map
                result.push({
                value: item.strength, 
                label:item.strength,
                });
            }
        }
        return result;
        
      } 

function makeDrugsOptions(field){    
  
        const arr =field.drugs.map(x => {
          return {value:x.substance, label:x.substance.name}
        });
        const result = [];
        const map = new Map();
        for (const item of arr) {
            if(!map.has(item.label)){
                map.set(item.label, true); 
                //console.log(drugs);   // set any value to Map
                result.push({
                value: item.value, 
                label:item.label,
                });
            }
}
        //console.log(result);
        return result;
      };

      function getUsesValue(field, selectedDrug){    
  
       
        //console.log(field);
        //console.log(selectedDrug);
        var arr = field.drugs.find(item=>item.form===selectedDrug.form&&item.strength===selectedDrug.strength&&item.name==selectedDrug.selected[0].name);
      //console.log(arr.uses);
      return arr.uses;
    };
    return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Treatment info</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" validated={props.validated} onSubmit={props.handleSubmit}>
        <Modal.Body>  
            <Form.Group >   
                {props.treatment.id===null?(<Form.Control type = "file" id="algorithm"  label="Algorithm" required onChange={props.handleInputChange} name="algorithm"/> ):(<Form.Control type = "file" id="algorithm"  label="Algorithm" onChange={props.handleInputChange} name="algorithm"/> )}         
                <Form.Control.Feedback type="invalid">
                    File is a required field.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>  
            {props.url===null?(<Image src={props.treatment.algorithm} fluid/>):(<Image src={props.url} fluid/>)}
            
            
            <Form.Group controlId="diagram">
            <Form.Label>Diagram</Form.Label>
            
            {props.treatment.diagram!==null?(
            <div className="mb-4 border">
                <ReactFlowProvider>
                <ReactFlow
                    elements={props.treatment.diagram!==undefined?(props.getElements(props.treatment.diagram)):([])}
                    snapGrid={[15, 15]}
                    style={{ width: "100%", height: 300 }} 
                    elementsSelectable={false}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    snapToGrid={true}
                    onLoad={onLoad}
                    >
                    <Controls/>
                    <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </ReactFlowProvider>
                </div>
            ):('')}
            
                        <Select
                            name="diagram"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            options={props.diagramsOptions}
                            //value={props.treatment.diagram!==undefined?({value: props.treatment.diagram, label: props.treatment.diagram.name}):('')}
                            onChange={e=>props.addSelectedDiagram(e)}
                            defaultValue={props.treatment.diagram!==null&&props.treatment.diagram!==undefined?({value: props.treatment.diagram, label: props.treatment.diagram.name}):('')}
                     />
                    </Form.Group>
                    
            <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" placeholder=""  value={props.treatment.title} onChange={props.handleInputChange} name="title"/>
            <Form.Control.Feedback type="invalid">
                Title is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
         <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.description} onChange={props.handleInputChange} name="description"/>
            <Form.Control.Feedback type="invalid">
                Description is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="uses">
            <Form.Label>Drug Treatment Adjustment</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.uses} onChange={props.handleInputChange} name="uses"/>
            <Form.Control.Feedback type="invalid">
            Drug Treatment Adjustment is a required field.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="public">
            <Form.Check  label={"Public"} disabled={props.treatment.isBlocked} checked={parseInt(props.treatment.public)} onChange={props.handleChecked} name="public"/>
            {(props.treatment.isBlocked?<Badge pill variant="danger">Blocked</Badge>:"")}
            </Form.Group>
    
            <Form.Group controlId="diseases"> 
            <Form.Label>Diseases</Form.Label>
            <AsyncSelect
                name="diseases"
                ref={props.setSelectRef}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable="true"
                cacheOptions
                defaultOptions
                loadOptions={props.loadOptions}
                onChange={props.handleOverviewsInputChange}
                defaultValue={props.treatment.disease!==null?({value: props.treatment.disease, label: props.treatment.disease.name}):('')}
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
                value = {props.treatment.disease || ""}
                onChange={props.handleOverviewsInputChange}
            />
            </Form.Group> 
            {console.log(props.treatment)}
            {props.fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        <Form.Group controlId="drugs">
                        <h4>Drug</h4>    
                        <Form.Label>Name</Form.Label>  
                        <Select
                            name="drugs"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            options={props.treatment.disease!==null?(makeDrugsOptions(props.treatment.disease)):('')}
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
                            options={field.drug !== ''&&props.treatment.disease!==null?(makeOptionsForm(props.treatment.disease, field)):('')}
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
                            options={field.form !== ''&&props.treatment.disease!==null?(makeOptionsStrength(props.treatment.disease,field)):('')}
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
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.treatment.disease!==null?(getUsesValue(props.treatment.disease, field)):('')} disabled  name="uses"/>
                    </Form.Group>):('')}
                    <div className="row">
  
                    <div className="container text-right"><a type="button" className="link_danger" onClick={()=>props.handleRemoveInput(idx)} >
                        <BsXCircle></BsXCircle>
                    </a></div>
                </div>
                    
                    </div>
                    )
                })
                }    
                
                            
                {props.treatment.disease!==null?(<div className="col-auto mr-auto mt-2">
                    <a type="button" className="link_success" size="sm" onClick={props.handleAddInput} >
                         Add Drug <BsPlusCircle></BsPlusCircle>
                    </a>
                </div>):('')}
                
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
            {props.treatment.id===null?(<Button type="submit" variant="primary">
                Create Treatment
            </Button>):(<Button type="submit" variant="primary">
                Update Treatment
            </Button>)}          
        </Modal.Footer>
        </Form>
    </Modal>
    );
}