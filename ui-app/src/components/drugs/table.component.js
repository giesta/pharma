import React from 'react';


import { Table, Badge } from "react-bootstrap";

export default function TableOfItems(props) {
    const handleIncrement = (counter) => {
        return (<div> { counter + props.rowNumber } </div>);
      };
    return (
        <Table striped bordered hover responsive="lg">
            <thead>
                <tr>
                {props.columns.map((field)=>
                    <th key={field.text}>{field.text}</th>
                )}
                </tr>
            </thead>
            <tbody>
            {
            props.drugs.map((field, counter)=>
                <tr key = {field.id}>
                    
                    <td>{handleIncrement(++counter)}</td>
                    <td>{field.registration.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge key={"badge_warning_"+counter} pill variant="warning">{field.name}</Badge>
                            :<Badge key={"badge_success_"+counter} pill variant="success">{field.name}</Badge>
                            }</td>
                    <td>{field.substance.split(/\/|\(|\)/).map((item, idx)=>
                        
                        <Badge key={"badge_primary_"+idx} pill variant="primary">{item}</Badge>
                            
                            )}</td>
                    <td>{field.ATC}</td>
                    <td>{field.strength}</td>
                    <td>{field.form}</td>
                    <td>{field.package}</td>                    
                    {props.GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}