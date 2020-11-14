import React from 'react';

import { Table } from "react-bootstrap";

export default function TableOfItems(props) {

    return (
        <Table striped bordered hover responsive="xl">
          <thead>
            <tr>
              {props.columns.map((field)=>
                <th key={field.text}>{field.text}</th>
              )}
            </tr>
          </thead>
          <tbody>    
          {
            props.Treatments.data.map((field, count=0)=>
              <tr key={count}>
              <td >{++count}</td>
              <td >{field.title}</td>
              <td >{field.description}</td>
              <td >{field.disease.name}</td>
              {props.GetActionFormat(field)}
            </tr>
            )  
          }
        </tbody>
      </Table>
    );
}