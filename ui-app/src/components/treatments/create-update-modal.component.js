import React from 'react';

import { Modal, Button, Form, Image, Badge, Alert } from "react-bootstrap";
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
            <Modal.Title>Gydymo algoritmo informacija</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" validated={props.validated} onSubmit={props.handleSubmit}>
        <Modal.Body> 
            {props.error?(<Alert variant="danger">Privalo būti pasirinktas arba schema ar ba diagrama!</Alert>):''}

        {(props.treatment.diagram===undefined||props.treatment.diagram===null)?(
            <>
            <Form.Group > 
            <Form.Label for="algorithm" className="btn btn-outline-success btn-sm ts-buttom">Select Image</Form.Label>  
                <Form.Control type = "file" id="algorithm" style={{display: "none"}}  label="Algorithm" onChange={props.handleInputChange} name="algorithm"/>        
                <Form.Control.Feedback type="invalid">
                    Failas būtinas.
                </Form.Control.Feedback>
                <Form.Control.Feedback>Atrodo gerai!</Form.Control.Feedback>
            </Form.Group> 
            {props.url!==null||props.treatment.algorithm!==''?(
            <div className="img-wrap">
                <a id="clear" type="button" className="link_danger" onClick={props.removeImageFile} ><BsXCircle/></a>
                {props.url===null?(<Image src={props.treatment.algorithm} fluid/>):(<Image src={props.url} fluid/>)}
            </div>
            ):''}
            
            </>):''}
            {((props.treatment.algorithm===null||props.treatment.algorithm==='')&&props.url===null)?(
                <Form.Group controlId="diagram">
            <Form.Label>Diagrama</Form.Label>
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
                            placeholder={"Pasirinkti ..."}
                            options={props.diagramsOptions}
                            onChange={e=>props.addSelectedDiagram(e)}
                            defaultValue={props.treatment.diagram!==null&&props.treatment.diagram!==undefined?({value: props.treatment.diagram, label: props.treatment.diagram.name}):('')}
                     />
                    </Form.Group>
                ):''}  
            
                    
            <Form.Group controlId="title">
            <Form.Label>Pavadinimas</Form.Label>
            <Form.Control required type="text" placeholder=""  value={props.treatment.title} onChange={props.handleInputChange} name="title"/>
            <Form.Control.Feedback type="invalid">
                Pavadinimas yra privalomas.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Atrodo gerai!</Form.Control.Feedback>
            </Form.Group>
         <Form.Group controlId="description">
            <Form.Label>Aprašymas</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.description} onChange={props.handleInputChange} name="description"/>
            <Form.Control.Feedback type="invalid">
                Aprašymas yra privalomas.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Atrodo gerai!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="uses">
            <Form.Label>Vaistų vartojimo patikslinimas</Form.Label>
            <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.uses} onChange={props.handleInputChange} name="uses"/>
            <Form.Control.Feedback type="invalid">
            Vaistų vartojimo patikslinimas privalomas.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Atrodo gerai!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="public">
            <Form.Check  label={"Viešas"} disabled={props.treatment.isBlocked} checked={parseInt(props.treatment.public)} onChange={props.handleChecked} name="public"/>
            {(props.treatment.isBlocked?<Badge pill variant="danger">Blokuotas</Badge>:"")}
            </Form.Group>
    
            <Form.Group controlId="diseases"> 
            <Form.Label>Liga</Form.Label>
            <AsyncSelect
                name="diseases"
                ref={props.setSelectRef}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable="true"
                cacheOptions
                defaultOptions
                placeholder={"Pasirinkti ..."}
                loadingMessage={() => "Ieškoma ..."}
                noOptionsMessage={() => "Nerasta"}
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
            {props.fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        <Form.Group controlId="drugs">
                        <h4>Vaistas</h4>    
                        <Form.Label>Veiklioji medžiaga</Form.Label>  
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
                        <Form.Label>Forma</Form.Label>     
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
                        <Form.Label>Stiprumas</Form.Label>     
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
                    <div><Form.Label>Pavadinimas</Form.Label>
                    {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item, idx)=>
                              item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                              <Badge key={"name_"+idx} pill variant="warning">{item.name}</Badge>
                                  :<Badge key={"name_"+idx} pill variant="success">{item.name}</Badge>
                          )):('')
                          }
                      </div>
                      {field.strength !== ''?(
                    <Form.Group controlId={`${field}-${idx}`}>
                        <Form.Label>Vartojimas</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={ field.uses !==null && field.uses!==''?(field.uses):(getUsesValue(props.treatment.disease, field))} disabled  name="uses"/>
                    </Form.Group>):('')}
                    <div className="row">
  
                    <div className="container text-right"><a type="button" className="link_danger" onClick={()=>props.handleRemoveInput(idx)} >
                        Šalinti <BsXCircle></BsXCircle>
                    </a></div>
                </div>
                    
                    </div>
                    )
                })
                }    
                
                            
                {props.treatment.disease!==null?(<div className="col-auto mr-auto mt-2">
                    <a type="button" className="link_success" size="sm" onClick={props.handleAddInput} >
                         Įtraukti vaistą <BsPlusCircle></BsPlusCircle>
                    </a>
                </div>):('')}
                
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Užverti
            </Button>
            {props.treatment.id===null?(<Button type="submit" variant="primary">
                Sukurti
            </Button>):(<Button type="submit" variant="primary">
                Atnaujinti
            </Button>)}          
        </Modal.Footer>
        </Form>
    </Modal>
    );
}