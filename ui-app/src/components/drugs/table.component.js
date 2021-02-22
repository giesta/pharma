import React from 'react';

import { Table } from "react-bootstrap";

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
                    <td>{field.drug.name}</td>
                    <td>{field.drug.substance}</td>
                    <td>{field.indication}</td>
                    <td>{field.contraindication}</td>
                    <td>{field.reaction}</td>
                    <td>{field.use}</td>
                    {props.GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}