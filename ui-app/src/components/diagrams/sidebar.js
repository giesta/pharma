import React from 'react';

export default (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Jūs galite nuvilkti viršūnę į sudarymo langą dešinėje.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Įvesties viršūnė
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Viršūnė
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Išvesties viršūnė
      </div>
      <div className="updatenode__controls">
        <label>Elemento tekstas:</label>
        <input
          value={props.nodeName}
          onChange={(evt) => props.setNodeName(evt.target.value)}
        />

        <label className="updatenode__bglabel">Elemento spalva:</label>
        <input value={props.nodeBg!==undefined?props.nodeBg:''} onChange={(evt) => props.setNodeBg(evt.target.value)} />

{props.edgeSelected?(
<>
<div className="updatenode__checkboxwrapper"><label>Animuota: </label>
<input
            type="checkbox"
            checked={props.animation}
            onChange={(evt) => {props.setAnimation(evt.target.checked);}}
          /></div>

<div><label>type:</label>
<select name="types" id="edgeType" onChange={(evt) => {props.setEdgeType(evt.target.value)}} value={props.edgeType}>
            <option value="default">Bezier briauna</option>
            <option value="straight">Tiesi briauna</option>
            <option value="step">Laiptuota briauna</option>
            <option value="smoothstep">Apvalinta briauna</option>
        </select>
        
        
       </div> 
        </>):('')}
        
        
      </div>
    </aside>
  );
};