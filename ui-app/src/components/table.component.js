import React, { useCallback, useEffect } from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(columns, treatments, GetActionFormat) {

    return (
        <Table striped bordered hover responsive="xl">
        <thead>
          <tr>
            {columns.map((field)=>
              <th>{field.text}</th>
            )}
          </tr>
        </thead>
        <tbody>      
        {
        treatments.data.map((field, count=0)=>
              <tr>
              <td>{++count}</td>
              <td>{field.title}</td>
              <td>{field.description}</td>
              <td>{field.disease.name}</td>
              {GetActionFormat(field)}
            </tr>
            )  
        }
        </tbody>
      </Table>
    );
}