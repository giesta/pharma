import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(columns, diseases, GetActionFormat) {

    return (
        <Table striped bordered hover responsive="lg">
            <thead>
                <tr>
                {columns.map((field)=>
                    <th key={field.text}>{field.text}</th>
                )}
                </tr>
            </thead>
            <tbody>
                {diseases.data.map((field, count = 0)=>
                    <tr key={++count}>
                    <td>{count}</td>
                    <td>{field.name}</td>
                    <td>{field.description}</td>
                    <td>{field.symptoms}</td>
                    {GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}