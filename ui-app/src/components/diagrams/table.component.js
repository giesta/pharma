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
            {props.leaflets.map((field, counter)=>
                <tr key = {field.id}>
                    
                    <td>{handleIncrement(++counter)}</td>                    
                    <td>{field.name}</td>
                    <td>{field.created_at}</td>
                    <td>{field.updated_at}</td>
                    {props.GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}