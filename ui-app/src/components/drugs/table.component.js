import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(columns, drugs, GetActionFormat) {

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

            {
            drugs.data.map((field, count = 0)=>
                <tr key = {field.id}>
                    <td>{++count}</td>
                    <td>{field.name}</td>
                    <td>{field.substance}</td>
                    <td>{field.indication}</td>
                    <td>{field.contraindication}</td>
                    <td>{field.reaction}</td>
                    <td>{field.use}</td>
                    {GetActionFormat(field)}
                </tr>
                )  
            }
            </tbody>
        </Table>
    );
}