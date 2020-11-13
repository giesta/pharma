import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(columns, treatments, GetActionFormat) {

    return (
        <Table striped bordered hover responsive="xl">
          <thead>
            <tr>
              {columns.map((field)=>
                <th key={field}>{field.text}</th>
              )}
            </tr>
          </thead>
          <tbody>      
          {
            treatments.data.map((field, count=0)=>
              <tr>
              <td key={count}>{++count}</td>
              <td key={field.title}>{field.title}</td>
              <td key={field.description}>{field.description}</td>
              <td key={field.disease.name}>{field.disease.name}</td>
              {GetActionFormat(field)}
            </tr>
            )  
          }
        </tbody>
      </Table>
    );
}