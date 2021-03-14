import React from 'react';

export default (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
      <div className="updatenode__controls">
        <label>label:</label>
        <input
          value={props.nodeName}
          onChange={(evt) => props.setNodeName(evt.target.value)}
        />

        <label className="updatenode__bglabel">background:</label>
        <input value={props.nodeBg!==undefined?props.nodeBg:''} onChange={(evt) => props.setNodeBg(evt.target.value)} />

{props.edgeSelected?(
<>
<div className="updatenode__checkboxwrapper"><label>animation: </label>
<input
            type="checkbox"
            checked={props.animation??'on'}
            onChange={(evt) => {props.setAnimation(evt.target.checked);console.log(evt.target.value)}}
          /></div>

<div><label>type:</label>
<select name="types" id="edgeType" onChange={(evt) => {props.setEdgeType(evt.target.value)}} value={props.edgeType}>
            <option value="default">Bezier Edge</option>
            <option value="straight">Straight Edge</option>
            <option value="step">Step Edge</option>
            <option value="smoothstep">Smooth Step Edge</option>
        </select>
        
        
       </div> 
        </>):('')}
        
        
      </div>
    </aside>
  );
};