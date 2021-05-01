import React from 'react';

import { Button, Badge, Card, CardDeck, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsEyeSlash, BsEye, BsStar } from "react-icons/bs";
import { FaCommentMedical } from "react-icons/fa";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
} from 'react-flow-renderer';

export default function TreatmentCard(props) {

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView({ padding: 0.8, includeHiddenNodes: true });
  };

  function getElements(diagram){
    var arr = diagram.nodes.concat(diagram.edges);
    var items = arr.map((el)=>{
      if(el.source === undefined){
        var item = {id:el.item_id, data:{label:el.label, style:{backgroundColor:el.background}}, style:{backgroundColor:el.background}, type:el.type, position:{x:parseInt(el.x), y:parseInt(el.y)}};
        return item;
      }else{
        var item = {id:el.item_id, data:{label:el.label, style:{stroke:el.stroke}, animated:el.animated===1?true:false}, animated:el.animated===1?true:false, arrowHeadType:el.arrow, label:el.label, style:{stroke:el.stroke}, type:el.type, source:el.source, target:el.target};
        return item;
      }
      
  });
  //setElements(items);
return items;
}
    return (
      
      <CardDeck >     
          {props.Treatments.map((field)=>
          <div className="col-xs-6 col-md-4" key={field.id}>
             <Card className="card-padding" style={{ width: '18rem', flex:1}}>
               {field.algorithm!==''?(<Card.Img variant="top" src={field.algorithm} style={{height: '300px'}} />):(
                 <div>
                 <ReactFlowProvider>
                 <ReactFlow
                     elements={field.diagram!==undefined&&field.diagram!==null?(getElements(field.diagram)):([])}
                     style={{ width: "100%", height: 300 }} 
                     elementsSelectable={false}
                     nodesConnectable={false}
                     nodesDraggable={false}
                     zoomOnScroll={false}
                     paneMoveable={false}
                     onLoad={onLoad}
                     >
                     <Background color="#aaa" gap={16} />
                     </ReactFlow>
                 </ReactFlowProvider>
                 </div>
                )}
              
              <Card.Body>
          <Card.Title>{field.title} {field.public?(<BsEye color="#ACD1B6"></BsEye>):(<BsEyeSlash color="#E96166"></BsEyeSlash>)}</Card.Title>               
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>Sukurta: {field.created}</ListGroupItem>
                <ListGroupItem>Atnaujinta: {field.updated}</ListGroupItem>               
              </ListGroup>
              <Card.Body>
                <Card.Link href={"/treatments/" + field.id}>Daugiau </Card.Link>{ }
                <Button variant="outline-primary" disabled size={"sm"}><BsStar color="#AA5725"></BsStar> <Badge color="DED18D">{field.stars}</Badge></Button>{' '}
                <Button variant="outline-primary" disabled size={"sm"}><FaCommentMedical color="#000000"></FaCommentMedical> <Badge color="DED18D">{field.comments.length}</Badge></Button>{' '}
              </Card.Body>
            </Card>
          </div>
      )}  
  </CardDeck>
    
  );
}