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
      
        {props.users.data.map((field, count = 0)=>
              <tr key={count}>
              <td>{++count}</td>
              <td>{field.name}</td>
              <td>{field.email}</td>
              {props.GetActionFormat(field)}
            </tr>
            )  
        }
        </tbody>
      </Table>
    );
}