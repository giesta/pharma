import React from 'react';

import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

export default function TreatmentCard(props) {
    return (
    <Card style={{ width: '18rem' },{flex:1}}>
      <Card.Img variant="top" src={props.algorithm} style={{height: '40vh'}} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>               
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>{props.disease.name}</ListGroupItem>
        <ListGroupItem>{props.disease.symptoms}</ListGroupItem>               
      </ListGroup>
      <Card.Body>
        <Card.Link href={"/treatments/" + props.id}>Read More</Card.Link>
      </Card.Body>
    </Card>
  );
}