import React, { useEffect, useState, useRef  } from 'react';
import DiagramsDataService from "../../services/diagrams/list.service";
import { Button, Form} from "react-bootstrap";
import ErrorBoundary from "../layout/error.component";
import { removeError } from "../../js/actions/index";
import store from "../../js/store/index";
import { connect } from "react-redux";

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

const mapStateToProps = state => {
  return { errors: state.rootReducer.errors };
};

let id = 0;
const getId = (count=0) => {
  var elementId = `node_${(id++) + count}`;
  return elementId;
}
const initialElements = [
    {
      id: getId(),
      type: 'input',
      data: { label: 'Viršūnė 1', style:{backgroundColor:''}  },
      position: { x: 250, y: 250 },
    },
  ];
const UpdateNode = (props) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(props.location.state!==undefined ? props.location.state.elements:initialElements);
  const [nodesCount] = useState(props.location.state!==undefined&&props.location.state.diagram!==undefined&&props.location.state.diagram.nodes[props.location.state.diagram.nodes.length-1]!==undefined ? props.location.state.diagram.nodes[props.location.state.diagram.nodes.length-1].item_id.split('_')[1]:1);
  const [validated, setValidated] = React.useState(false);
  const [element, setElement] = useState({});
  const [nodeName, setNodeName] = useState('Viršūnė');
  const [nodeBg, setNodeBg] = useState('#eee');
  const [edgeType, setEdgeType] = useState('step');
  const [animation, setAnimation] = useState(false);
  const [diagramName, setDiagramName] = useState(props.location.state!==undefined ? props.location.state.diagram.name:'');

  const [error, setError] = useState(false);
  const {dispatch} = store; 

  const onElementClick=(event, element)=>{
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
  const handleClose = () => {
    dispatch(removeError());
  }
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance) => {
    _reactFlowInstance.fitView();
    setReactFlowInstance(_reactFlowInstance);
  };
  const onEdgeUpdate = (oldEdge, newConnection) =>{  
    var oldValue = elements.find(element=>element.id===oldEdge.id);
    setElements((els) =>{
      if(els.find(element=>element.id==='reactflow__edge-'+newConnection.source+newConnection.sourceHandle+'-'+newConnection.target+newConnection.targetHandle)!==undefined){
        return els;
      }
      return updateEdge(oldValue, newConnection, els);        
    });     
  } 

const onNodeDragStop =(event, node)=>{
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
  const onConnect = (params) =>{
    setElements((els) =>
      addEdge({ ...params, label:'', animated:false, type: 'step', data: {
        label: '', style:'', animated:false
      }, arrowHeadType: 'arrowclosed' }, els)
    );
  }  

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
          data: { label: `Viršūnė`, style:{backgroundColor:''} },          
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
            el.label = nodeName;
            }        
        }
        return el;
      })
    );
  }, [nodeName,  element]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
          if(element.source===undefined){
            el.data = {
            ...el.data,
            style: { ...el.style, backgroundColor: nodeBg },
            };
            el.style={background: nodeBg};
          }else{
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
  }, [nodeBg, element]);

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
  }, [edgeType]);
  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
            if(element.source!==undefined){
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
  }, [animation, element]);  

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {      
      event.stopPropagation();
      setValidated(true);
    }else if(props.location.state!==undefined){
       updateDiagram(props.location.state.diagram.id);
    }else{
      setValidated(true);
      saveDiagram();      
    }      
  };
  const saveDiagram = () => {
  var newElements = elements.map((el)=>{
      const {id: item_id, ...rest} = el;
      return {item_id, ...rest};
  });
    var data = {
      name: diagramName,
      nodes: JSON.stringify(newElements.filter((el)=>{ return el.source === undefined})),
      edges: JSON.stringify(newElements.filter((el)=>{return el.source !== undefined})),
    };
    DiagramsDataService.create(data)
      .then(() => {
        dispatch(removeError());
        props.history.push("/diagrams");
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });      
  };
  const updateDiagram = (id) => {
  var newElements = elements.map((el)=>{
      const {id: item_id, ...rest} = el;
      return {item_id, ...rest};
  });
  var nodes = newElements.filter((el)=>{return el.source === undefined });
  var edges = newElements.filter((el)=>{return el.source !== undefined });
    var data = {
      name: diagramName,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    };
    DiagramsDataService.update(id, data)
      .then(() => {
        dispatch(removeError());
        props.history.push("/diagrams");
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });      
  };
  return (
    <div>
      {error ?<ErrorBoundary text="Atsiprašome, įvyko klaida"/>:''}
      {props.errors.length > 0 ?<ErrorBoundary text={props.errors.map(item=>item)} handleClose={handleClose}/>:''}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="name"> <Form.Label>Diagramos pavadinimas</Form.Label>        
          <Form.Control type="text" placeholder="" defaultValue={diagramName} required onChange={(evt) => {setDiagramName(evt.target.value)}} name="name"/>
          <Form.Control.Feedback type="invalid">
            Pavadinimas yra privalomas.
          </Form.Control.Feedback>
          <Form.Control.Feedback>Atrodo gerai!</Form.Control.Feedback>
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
      style={{ width: 950, height: 900 }} 
      connectionLineType="step"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onEdgeUpdate={onEdgeUpdate}
      onElementClick={onElementClick}
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
      <Button className="mt-3" disabled={props.errors.length > 0} type="submit" variant="primary">Išsaugoti</Button>
    </Form>
    </div>
  );
};
const Creation = connect(mapStateToProps)(UpdateNode);
export default Creation;