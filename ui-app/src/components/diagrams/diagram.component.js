import React, { useEffect, useState, useRef  } from 'react';
import DiagramsDataService from "../../services/diagrams/list.service";
import { Button, Form, Row, Col} from "react-bootstrap";
import ReactFlow, {
    removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  updateEdge
  } from 'react-flow-renderer';

import './updatenode.css';

import Sidebar from './sidebar';

let id = 0;
const getId = (count=0) => {
  var elementId = `node_${(id++) + count}`;
  return elementId;
}
const initialElements = [
    {
      id: getId(),
      type: 'input',
      data: { label: 'Node 1', style:{backgroundColor:''}  },
      position: { x: 250, y: 250 },
    },
  ];

  


const UpdateNode = (props) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(props.location.state!==undefined ? props.location.state.elements:initialElements);
  const [nodesCount, setNodesCount] = useState(props.location.state!==undefined&&props.location.state.diagram!==undefined&&props.location.state.diagram.nodes[props.location.state.diagram.nodes.length-1]!==undefined ? props.location.state.diagram.nodes[props.location.state.diagram.nodes.length-1].item_id.split('_')[1]:1);
  
  const [element, setElement] = useState({});
  const [nodeName, setNodeName] = useState('Node 1');
  const [nodeBg, setNodeBg] = useState('#eee');
  const [edgeSelected, setEdgeSelected] = useState(false);
  const [edgeType, setEdgeType] = useState('step');
  const [animation, setAnimation] = useState(false);
  const [diagramName, setDiagramName] = useState(props.location.state!==undefined ? props.location.state.diagram.name:'');

  const onElementClick=(event, element)=>{
      console.log(element);
      setElement(element);
      if(element.data !== undefined){
         setNodeName(element.data.label); 
         setNodeBg(element.data.style.backgroundColor);
         if(element.source !== undefined){
             setEdgeType(element.type);
             setAnimation(element.data.animated);
             setNodeBg(element.data.style.stroke);
         }         
      }else{
        setNodeName(element.label);
      }      
  }  

  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance) => {
    console.log('flow loaded:', _reactFlowInstance);
    _reactFlowInstance.fitView();
    setReactFlowInstance(_reactFlowInstance);
  };

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge, newConnection) =>{  
    var oldValue = elements.find(element=>element.id===oldEdge.id);
    setElements((els) => updateEdge(oldValue, newConnection, els));     
  } 
const onNodeDragStop =(event, node)=>{
console.log(node);
setElements((els) =>
      els.map((el) => {
        if (el.id === node.id) {
            el.position = {
                ...el.position,
                x: node.position.x,
                y: node.position.y,
            }; 
            
        }
        return el;
      })
    );
}
  const onConnect = (params) =>
    setElements((els) =>
      addEdge({ ...params, label:'', animated:false, type: 'step', data: {
        label: '', style:'', animated:false
      }, arrowHeadType: 'arrowclosed' }, els)
    );

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      };

      const onDrop = (event) => {
        
        event.preventDefault();
    
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
          id: getId(nodesCount),
          type,
          position,
          data: { label: `${type} node`, style:{backgroundColor:''} },          
        };    
        setElements((es) => es.concat(newNode));
      };

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
            el.data = {
                ...el.data,
                label: nodeName,
            }; 
            if(el.label !== undefined){
                // it's important that you create a new object here
            // in order to notify react flow about the change
            el.label = nodeName;
            }        
        }
        return el;
      })
    );
  }, [nodeName, setElements]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          if(element.source===undefined){
            el.data = {
            ...el.data,
            style: { ...el.style, backgroundColor: nodeBg },
            };
            el.style={background: nodeBg};
          }else{
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style= {...el.style, stroke: nodeBg };
            el.data = {
              ...el.data,
              style: { ...el.style, stroke: nodeBg },
            };
          }
           
        
             
        }
        return el;
      })
    );
  }, [nodeBg, setElements]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
            if(element.source!==undefined){
                el.type = edgeType;
            }                
        }
        return el;
      })
    );
  }, [edgeType, setElements]);
  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
            if(element.source!==undefined){
              console.log(animation);
                el.animated = animation;
                el.data = {
                  ...el.data,
                  animated: animation,
              };
            }
                
        }

        return el;
      })
    );
  }, [animation, setElements]);  

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.stopPropagation();
    }else if(props.location.state!==undefined){
       updateDiagram(props.location.state.diagram.id);
    }else{
      saveDiagram();
    }      
  };

  

  const saveDiagram = () => {
    console.log(elements);
  var newElements = elements.map((el)=>{
      const {id: item_id, ...rest} = el;
      return {item_id, ...rest};
  });
    var data = {
      name: diagramName,
      nodes: JSON.stringify(newElements.filter((el)=>{
        if(el.source === undefined){
          return el;
        }
      })),
      edges: JSON.stringify(newElements.filter((el)=>{
        if(el.source !== undefined){
          return el;
        }
      })),
    };
    console.log(data);
    DiagramsDataService.create(data)
      .then((response) => {
        console.log(response.data);
        props.history.push("/diagrams");
      })
      .catch(e => {
        //setError(true);
        console.log(e);
      });
      console.log("-----Veikia saugojimas-----");
      console.log(elements);
      
  };
  const updateDiagram = (id) => {
    console.log(elements);
  var newElements = elements.map((el)=>{
      const {id: item_id, ...rest} = el;
      return {item_id, ...rest};
  });
  console.log(newElements);
  var nodes = newElements.filter((el)=>{
    if(el.source === undefined){
      console.log(el);
      return el;
    }
  });
  var edges = newElements.filter((el)=>{
    if(el.source !== undefined){
      console.log(el);
      return el;
    }
  });
  console.log(edges);
    var data = {
      name: diagramName,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    };
    console.log(data);
    DiagramsDataService.update(id, data)
      .then((response) => {
        console.log(response.data);
        props.history.push("/diagrams");
      })
      .catch(e => {
        //setError(true);
        console.log(e);
      });
      console.log("-----Veikia atnaujinimas-----");
      console.log(elements);
      
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name"> <Form.Label>Diagram Name</Form.Label>        
              <Form.Control type="text" placeholder="" defaultValue={diagramName} required onChange={(evt) => {setDiagramName(evt.target.value)}} name="name"/>
              <Form.Control.Feedback type="invalid">
                  Name is a required field.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
      
      
    
    
    <div className="dndflow">
    <ReactFlowProvider>
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[10, 10]}
      style={{ width: 1000, height: 900 }} 
      connectionLineType="step"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onEdgeUpdate={onEdgeUpdate}
      onElementClick={onElementClick}
      snapToGrid={true}
      onNodeDragStop={onNodeDragStop}
    >

      
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return 'red';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background variant="lines" />
    </ReactFlow>
    </div>
    <Sidebar
        setEdgeType={setEdgeType}
        edgeSelected={element.source!==undefined}
        edgeType={edgeType}
        nodeBg={nodeBg}
        setNodeBg={setNodeBg}
        setNodeName={setNodeName}
        nodeName={nodeName}
        animation={animation}
        setAnimation={setAnimation}
    />
    
    </ReactFlowProvider>
    </div>
      <Button className="mt-3" type="submit" variant="primary">Save Diagram</Button>
    </Form>
    </div>
  );
};

export default UpdateNode;