import React, { useCallback, useEffect } from 'react';

import { Card, Modal, ListGroup, ListGroupItem } from "react-bootstrap";

export default function TreatmentCard(props) {

    return (
             <Card style={{ width: '18rem' },{flex:1}}>
             <Card.Img variant="top" src={props.algorithm} style={{height: '40vh'}} />
             <Card.Body>
               <Card.Title>{props.title}</Card.Title>
               <Card.Text style={{height: '10vh'}}>
                 {props.description}
               </Card.Text>
             </Card.Body>
             <ListGroup className="list-group-flush">
        <ListGroupItem>{props.disease.name}</ListGroupItem>
            <ListGroupItem>{props.disease.description}</ListGroupItem>
            <ListGroupItem>{props.disease.symptoms}</ListGroupItem>               
             </ListGroup>
             <Card.Body>
               <Card.Link href={"/treatments/" + props.id}>Read More</Card.Link>
             </Card.Body>
           </Card>
    );
}