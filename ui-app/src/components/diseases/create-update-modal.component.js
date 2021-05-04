import React from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { BsPlusCircle, BsXCircle } from "react-icons/bs";

export default function CreateModal(props) {
    function makeOptions(field){
        var arr = field.drug.drugs.map(item=>item.form);
        arr = [...new Set(arr)];
        return arr.map(item=>{
            return { value: item, label: item}
        })        
    } 
    function makeOptionsStrength(field){
        var arrStrength = field.drug.drugs.filter(item=>item.form===field.form);
        var strengths = arrStrength.map(item=>item.strength);
        var arr = [...new Set(strengths)];
        arr = arr.map(item=>{
            return { value: item, label: item}
        });        
        return arr;        
    } 
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ligos informacija</Modal.Title>
            </Modal.Header>
            
            <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
                <Modal.Body>  
                    <Form.Group controlId="name">
                        <Form.Label>Pavadinimas</Form.Label>
                        <AsyncSelect
                            ref={props.setSelectRef}
                            name="disease"
                            placeholder={"Pasirinkti ..."}
                            loadingMessage={() => "Ieškoma ..."}
                            noOptionsMessage={() => "Nerasta"}
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
                            Pavadinimas yra privalomas.
                        </Form.Control.Feedback >
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" required value={props.disease.description} onChange={props.handleInputChange} name="description"/>
                        <Form.Control.Feedback type="invalid">
                            Aprašymas yra privalomas.
                        </Form.Control.Feedback >
                    </Form.Group>  
                    <Form.Group controlId="diagnosis">
                        <Form.Label>Diagnozavimas</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.diagnosis} onChange={props.handleInputChange} name="diagnosis"/>
                    </Form.Group> 
                    <Form.Group controlId="symptoms"> 
                    <Form.Label>Simptomai</Form.Label>
                    <AsyncSelect
                        name="symptoms"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isClearable="true"
                        isMulti
                        cacheOptions
                        defaultOptions
                        placeholder={"Pasirinkti ..."}
                        loadingMessage={() => "Ieškoma ..."}
                        noOptionsMessage={() => "Nerasta"}
                        loadOptions={props.loadOptions}
                        onChange={props.handleSymptomsInputChange}
                        defaultValue={props.disease.symptoms!==null&&props.disease.symptoms!==undefined?(props.disease.symptoms.map(item=>
                        ({value: item, label: item.name})
                    
                        )):('')}
                     /> 
                     </Form.Group>
                     <Form.Group controlId="prevention">
                        <Form.Label>Prevencija</Form.Label>
                        <Form.Control type="text"  as="textarea" placeholder="" value={props.disease.prevention} onChange={props.handleInputChange} name="prevention"/>
                    </Form.Group>                                       
                {
                   
                }  
                {props.fields.map((field, idx)=>{
                    return (
                        <div key={`${field}-${idx}`} className="border border-secondary p-3 mt-2">
                        <Form.Group controlId="drugs">
                        <h4>Vaistas</h4>    
                        <Form.Label>Veiklioji medžiaga</Form.Label>  
                        <AsyncSelect
                            name="drugs"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            placeholder={"Pasirinkti ..."}
                            loadingMessage={() => "Ieškoma ..."}
                            noOptionsMessage={() => "Nerasta"}
                            loadOptions={props.loadDrugsOptions}
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
                            options={field.drug !== ''?(makeOptions(field)):('')}
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
                        </Form.Control.Feedback >
                    </Form.Group>
                    ):('')                    
                    }
                    {field.form !== ''?(
                        <Form.Group controlId="strength">
                        <Form.Label>Stiprumas</Form.Label>     
                        <Select
                            name="form"
                            ref={props.setSelectRef}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isClearable="true"
                            cacheOptions
                            defaultOptions
                            placeholder={"Pasirinkti ..."}
                            value={field.strength!==''?({value: field.strength, label: field.strength}):('')}
                            onChange={(e)=>props.addSelectedStrength(idx, e)}
                            options={field.form !== ''?(makeOptionsStrength(field)):('')}
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
                        </Form.Control.Feedback >
                    </Form.Group>
                    ):('')                     
                    }
                    <div>
                    <Form.Label>Pavadinimas</Form.Label> 
                    {field.selected!==undefined && field.selected.length!==0?(field.selected.map((item, idx)=>
                              item.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                              <Badge key={"badge__"+idx} pill variant="warning">{item.name}</Badge>
                                  :<Badge key={"badge_success_"+idx} pill variant="success">{item.name}</Badge>
                          )):('')
                          }
                      </div>
                      {field.strength !== ''?(
                    <Form.Group controlId={`${field}-${idx}`}>
                        <Form.Label>Vartojimas</Form.Label>
                        <Form.Control type="text"  as="textarea" required placeholder="" value={field.uses} onChange={(e)=>props.handleAddedInputChange(idx, e)}  name="uses"/>
                    </Form.Group>):('')}
                        <div className="row">  
                            <div className="container text-right">
                                <a type="button" className="link_danger" onClick={()=>props.handleRemoveInput(idx)} >Šalinti <BsXCircle/></a>
                            </div>
                        </div>                    
                    </div>
                    )
                })}               
                <div className="col-auto mr-auto mt-2">
                    <a type="button" className="link_success" size="sm" onClick={props.handleAddInput} >Įtraukti vaistą <BsPlusCircle></BsPlusCircle></a>
                </div>                       
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Užverti
                    </Button>
                        {props.disease.id===null?(<Button type="submit" variant="primary">
                            Sukurti
                    </Button>):(<Button type="submit" variant="primary">
                        Atnaujinti
                    </Button>)}          
                </Modal.Footer>
            </Form>
      </Modal>
    );
}