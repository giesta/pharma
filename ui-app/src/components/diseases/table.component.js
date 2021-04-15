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
                {props.diseases.map((field, count)=>
                    <tr key={++count}>
                    <td>{handleIncrement(++count)}</td>
                    <td>{field.name}</td>
                    <td>{field.description}</td>
                    <td>
                    {field.symptoms!==undefined?(field.symptoms.map((item, idx)=>
                        
                        <Badge key={idx} pill variant="primary">{item.name}</Badge>
                            
                            )):('')}
                    </td>
                    {props.GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}