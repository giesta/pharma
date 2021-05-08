import React from 'react';

import { Modal, Button, Form, Image, Badge, Alert } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";
import { connect } from "react-redux";
import ErrorBoundary from "../layout/error.component";
import ReactFlow, {
    Controls,
    Background,
    ReactFlowProvider,
  } from 'react-flow-renderer';
  
const mapStateToProps = state => {
    return { errors: state.rootReducer.errors };
};

const CreateUpdateModal = (props) =>{
    
    const onLoad = (reactFlowInstance) => {
        reactFlowInstance.fitView({ padding: 0.8, includeHiddenNodes: true });
      };
 
    function makeOptionsForm(field, selectedDrug){
        var arr = field.drugs.filter(item=>item.substance.name===selectedDrug.drug.name);
        const result = [];
        const map = new Map();
        for (const item of arr) {
            if(!map.has(item.form)){
                map.set(item.form, true); 
                result.push({
                value: item.form, 
                label:item.form,
                });
            }
        }
        return result;        
    } 
    function makeOptionsStrength(field, selectedDrug){
        var arr = field.drugs.filter(item=>item.substance.name===selectedDrug.drug.name&&item.form===selectedDrug.form);
        const result = [];
        const map = new Map();
        for (const item of arr) {
            if(!map.has(item.strength)){
                map.set(item.strength, true); 
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
                result.push({
                value: item.value, 
                label:item.label,
                });
            }
        }
        return result;
    };

    function getUsesValue(field, selectedDrug){
        if(field!==null){
            var arr = field.drugs.find(item=>item.form===selectedDrug.form&&item.strength===selectedDrug.strength&&item.name===selectedDrug.selected[0].name);
            return arr.uses;
        }else{
            return [];
        }          
    };
    return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Gydymo algoritmo informacija</Modal.Title>
        </Modal.Header>
        <Form noValidate encType="multipart/form-data" validated={props.validated} onSubmit={props.handleSubmit}>
        <Modal.Body> 
            {props.errorText!==''?(<Alert variant="danger">{props.errorText}</Alert>):''}
            {props.errors.length > 0 ?<ErrorBoundary text={props.errors.map(item=>item)} handleClose={props.closeError}/>:('')}
            {(props.treatment.diagram===undefined||props.treatment.diagram===null)?(
                <>
                    <Form.Group > 
                        <Form.Label htmlFor="algorithm" className="btn btn-outline-success btn-sm ts-buttom">Pasirinkti schemą</Form.Label>  
                            <Form.Control type = "file" id="algorithm" style={{display: "none"}}  label="Algorithm" onChange={props.handleInputChange} name="algorithm"/>        
                    </Form.Group> 
                    {props.url!==null||props.treatment.algorithm!==''?(
                        <div className="img-wrap">
                            <a id="clear" type="button" className="link_danger" onClick={props.removeImageFile} >Šalinti <BsXCircle/></a>
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
                <Form.Control required type="text" placeholder="" value={props.treatment.title} onChange={props.handleInputChange} name="title"/>
                <Form.Control.Feedback type="invalid">
                    Pavadinimas yra privalomas.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Aprašymas</Form.Label>
                    <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.description} onChange={props.handleInputChange} name="description"/>
                <Form.Control.Feedback type="invalid">
                Aprašymas yra privalomas.
                </Form.Control.Feedback>
            </Form.Group>
                <Form.Group controlId="uses">
                <Form.Label>Vaistų vartojimo patikslinimas</Form.Label>
                <Form.Control type="text" as="textarea" placeholder="" required value={props.treatment.uses} onChange={props.handleInputChange} name="uses"/>
                <Form.Control.Feedback type="invalid">
                Vaistų vartojimo patikslinimas privalomas.
                </Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">
                    Ligos pavadinimas privalomas.
                </Form.Control.Feedback>
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
                                    placeholder={"Pasirinkti ..."}
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
                            ref={props.setSelectRef}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            placeholder={"Pasirinkti ..."}
                            value={field.form!==''?({value: field.form, label: field.form}):('')}
                            onChange={(e)=>props.addSelectedForm(idx, e)}
                            options={field.drug !== ''&&props.treatment.disease!==null?(makeOptionsForm(props.treatment.disease, field)):('')}
                            defaultValue={field.form!==''?({value: field.form, label: field.form}):('')}/>                       
                        
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
                            value = {field.form || ""}
                            onChange={(e)=>props.addSelectedForm(idx, e)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Forma yra privaloma.
                        </Form.Control.Feedback>
                    </Form.Group>
                    ):('')                     
                    }
                    {field.form !== ''?(
                        <Form.Group controlId="strength">
                        <Form.Label>Stiprumas</Form.Label>     
                        <Select
                            name="strength"
                            ref={props.setSelectRef}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            placeholder={"Pasirinkti ..."}
                            value={field.strength!==''?({value: field.strength, label: field.strength}):('')}
                            onChange={(e)=>props.addSelectedStrength(idx, e)}
                            options={field.form !== ''&&props.treatment.disease!==null?(makeOptionsStrength(props.treatment.disease,field)):('')}
                            defaultValue={field.strength!==''?({value: field.strength, label: field.strength}):('')}/>
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
                            value = {field.strength || ""}
                            onChange={(e)=>props.addSelectedStrength(idx, e)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Stiprumas yra privalomas.
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">
                            Vartojimas yra privalomas.
                        </Form.Control.Feedback>
                    </Form.Group>):('')}
                    <div className="row">  
                        <div className="container text-right">
                            <a type="button" className="link_danger" onClick={()=>props.handleRemoveInput(idx)} >
                                Šalinti <BsXCircle/>
                            </a>
                        </div>
                    </div>                    
                </div>
            )
            })}    
            {props.treatment.disease!==null?(
            <div className="col-auto mr-auto mt-2">
                <a type="button" className="link_success" size="sm" onClick={props.handleAddInput} >
                    Įtraukti vaistą <BsPlusCircle></BsPlusCircle>
                </a>
            </div>
            ):('')}                
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Užverti
            </Button>
            {props.treatment.id===null?(<Button type="submit" disabled={props.errors.length > 0} variant="primary">
                Sukurti
            </Button>):(<Button type="submit" disabled={props.errors.length > 0} variant="primary">
                Atnaujinti
            </Button>)}          
        </Modal.Footer>
    </Form>
    </Modal>
    );
}
const Creation = connect(mapStateToProps)(CreateUpdateModal);
export default Creation;