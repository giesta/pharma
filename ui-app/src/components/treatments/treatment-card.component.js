import React from 'react';

import { Button, Badge, Card, CardDeck, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsEyeSlash, BsEye, BsStar } from "react-icons/bs";
import { FaCommentMedical } from "react-icons/fa";

export default function TreatmentCard(props) {
    return (
      
      <CardDeck>     
          {props.Treatments.map((field)=>
          <div className="col-xs-6 col-md-4" key={field.id}>
             <Card style={{ width: '18rem', flex:1}}>
              <Card.Img variant="top" src={field.algorithm} style={{height: '40vh'}} />
              <Card.Body>
          <Card.Title>{field.title} {field.public?(<BsEye color="#ACD1B6"></BsEye>):(<BsEyeSlash color="#E96166"></BsEyeSlash>)}</Card.Title>               
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>Created: {field.created}</ListGroupItem>
                <ListGroupItem>Updated: {field.updated}</ListGroupItem>               
              </ListGroup>
              <Card.Body>
                <Card.Link href={"/treatments/" + field.id}>Read More </Card.Link>{ }
                <Button variant="outline-primary" disabled size={"sm"}><BsStar color="#AA5725"></BsStar> <Badge color="DED18D">{field.stars}</Badge></Button>{' '}
                <Button variant="outline-primary" disabled size={"sm"}><FaCommentMedical color="#000000"></FaCommentMedical> <Badge color="DED18D">{field.comments.length}</Badge></Button>{' '}
              </Card.Body>
            </Card>
          </div>
      )}  
  </CardDeck>
    
  );
}