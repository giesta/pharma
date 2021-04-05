import React, { useState} from 'react';

import { Modal, Button} from "react-bootstrap";
import ReactFlow, {
    Controls,
    Background,
    ReactFlowProvider,
  } from 'react-flow-renderer';    
    
    export default function InfoModal(props) {
    const onLoad = (reactFlowInstance) => {
      console.log('flow loaded:', reactFlowInstance);
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
    };
        console.log(props.elements);
      const [elements, setElements] = useState(props.elements);
    return (
        <Modal size="xl" show={props.info} onHide={props.handleCloseInfo}>
            <Modal.Header closeButton>
                <Modal.Title>{props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <ReactFlowProvider>
            <ReactFlow
                elements={elements}
                snapGrid={[15, 15]}
                style={{ width: "100%", height: 500 }} 
                elementsSelectable={false}
                nodesConnectable={false}
                nodesDraggable={false}
                snapToGrid={true}
                onLoad={onLoad}
                >
                <Controls/>
                <Background color="#aaa" gap={16} />
                </ReactFlow>
</ReactFlowProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseInfo}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}