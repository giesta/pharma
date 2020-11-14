import React from 'react';

import { Card, CardDeck, ListGroup, ListGroupItem } from "react-bootstrap";

export default function TreatmentCard(props) {
    return (
      
      <CardDeck>     
          {props.Treatments.map((field)=>
          <div className="col-xs-6 col-md-4" key={field.id}>
             <Card style={{ width: '18rem' },{flex:1}}>
              <Card.Img variant="top" src={field.algorithm} style={{height: '40vh'}} />
              <Card.Body>
                <Card.Title>{field.title}</Card.Title>               
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>{field.disease.name}</ListGroupItem>
                <ListGroupItem>{field.disease.symptoms}</ListGroupItem>               
              </ListGroup>
              <Card.Body>
                <Card.Link href={"/treatments/" + field.id}>Read More</Card.Link>
              </Card.Body>
            </Card>
          </div>
      )}  
  </CardDeck>
    
  );
}