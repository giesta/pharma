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
            {props.leaflets.map((field, counter)=>
                <tr key = {field.id}>
                    
                    <td>{handleIncrement(++counter)}</td>
                    <td>{field.drug.name.split(';').map(item=>
                        item.toUpperCase().includes("IŠREGISTRUOTAS")?
                        <Badge pill variant="warning">{item.split('(')[0]}</Badge>
                            :<Badge pill variant="success">{item.split('(')[0]}</Badge>
                            )}</td>
                    <td>{field.drug.substance.split(/\/|\(|\)/).map(item=>
                        
                        <Badge pill variant="primary">{item}</Badge>
                            
                            )}</td>
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