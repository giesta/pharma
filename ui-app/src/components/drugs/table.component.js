import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(props) {

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
            props.drugs.data.map((field, count = 0)=>
                <tr key = {field.id}>
                    <td>{++count}</td>
                    <td>{field.name}</td>
                    <td>{field.substance}</td>
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