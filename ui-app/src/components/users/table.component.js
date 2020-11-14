import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(columns, users, GetActionFormat) {

    return (
        <Table striped bordered hover responsive="lg">
        <thead>
          <tr>
            {columns.map((field)=>
              <th>{field.text}</th>
            )}
          </tr>
        </thead>
        <tbody>
      
        {users.data.map((field)=>
              <tr>
              <td>{field.id}</td>
              <td>{field.name}</td>
              <td>{field.email}</td>
              {GetActionFormat(field)}
            </tr>
            )  
        }
        </tbody>
      </Table>
    );
}