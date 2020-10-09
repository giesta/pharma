import React, { useCallback, useEffect } from 'react';

import { Card, Modal, ListGroup, ListGroupItem } from "react-bootstrap";

export default function Treatment(props) {

    return (
             <Card style={{ width: '18rem' }}>
             <Card.Img variant="top" src={props.algorithm} />
             <Card.Body>
               <Card.Title>{props.title}</Card.Title>
               <Card.Text>
                 {props.description}
               </Card.Text>
             </Card.Body>
             <ListGroup className="list-group-flush">
        <ListGroupItem>{props.disease.name}</ListGroupItem>
               <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
               <ListGroupItem>Vestibulum at eros</ListGroupItem>
             </ListGroup>
             <Card.Body>
               <Card.Link href="#">Card Link</Card.Link>
               <Card.Link href="#">Another Link</Card.Link>
             </Card.Body>
           </Card>
    );
}