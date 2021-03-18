import React, { useState, useEffect } from 'react';

import { Modal, Button, Form, Badge} from "react-bootstrap";
import ReactFlow, {
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
  } from 'react-flow-renderer';


    import initialElements from './initial-elements';

    const onLoad = (reactFlowInstance) => {
      console.log('flow loaded:', reactFlowInstance);
      reactFlowInstance.fitView();
    };
    
    export default function InfoModal(props) {
        console.log(props.elements);
      const [elements, setElements] = useState(props.elements);
      const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
      const onConnect = (params) => setElements((els) => addEdge(params, els));
    return (
        <Modal size="xl" show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Drug info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <ReactFlow
                elements={elements}
                snapGrid={[15, 15]}
                style={{ width: "100%", height: 600 }} 
                elementsSelectable={false}
                nodesConnectable={false}
                nodesDraggable={false}
                snapToGrid={true}
                onLoad={onLoad}
                >
                <Controls/>
                <Background color="#aaa" gap={16} />
                </ReactFlow>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}