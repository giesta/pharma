import React, { useState } from "react";
import {
  FaAngleRight,
  FaAngleDown,
  FaRegFolder,
  FaRegFolderOpen,
  FaGlobe,
  FaPills,
  FaVial,
  FaBriefcaseMedical,
  FaMedrt
} from "react-icons/fa";
import { ListGroup} from "react-bootstrap";
import DrugInfo from "../drugs/info-modal.component";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const leaf = { paddingLeft: "70px" };
const branch = { paddingLeft: "40px" };
const leaf2 = { paddingLeft: "100px" };

const Leaf2 = ({ drug, label }, idx) => {
    const [currentDrug, setCurrentDrug] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () =>{
        newDrug();
        setShow(false);
      };
      const newDrug = () => {
        setCurrentDrug({});
      };
    return (
        <>
        <ListGroup.Item 
        action
        style={leaf2}
        key={`leaf-${idx}`}
        onClick={function(event){ setCurrentDrug(drug); setShow(true)}}
      >
        <FaMedrt /> {label}
        </ListGroup.Item >{console.log(currentDrug)}
        { show &&<DrugInfo info = {show} drug = {currentDrug} handleCloseInfo={handleClose}></DrugInfo> } 
        </>
    );
  };

const Leaf = ({label, children }, idx) => {
    const [open, setOpen] = useState(false);
  const childList =children.map(Leaf2);
  return (
      <>
    <ListGroup.Item 
      style={leaf}
      action
      key={`leaf-${idx}`}
      onClick={() => setOpen(!open)}
    >
      {open ? <FaAngleDown /> : <FaAngleRight />}{" "}
        { <FaVial />} {label}
    </ListGroup.Item >
    {open && childList}
    </>
  );
};

const Branch = ({ label, children }, idx) => {
  const [open, setOpen] = useState(false);
  const childList = children.map(Leaf);
  return (
    <>
      <ListGroup.Item 
        style={branch}
        action
        onClick={() => setOpen(!open)}
        key={`branch-${idx}`}
      >
        {open ? <FaAngleDown /> : <FaAngleRight />}{" "}
        {<FaPills />} {label}
      </ListGroup.Item >
      {open && childList}
    </>
  );
};

const Root = ({ label, children }, idx) => {
  const [open, setOpen] = useState(false);
  const childList = children.map(Branch);
  return (
    <>
    <ListGroup.Item 
    key={`root-${idx}`} 
    action 
    onClick={() => setOpen(!open)}>
        {open ? <FaAngleDown /> : <FaAngleRight />}{" "}
        { <FaBriefcaseMedical />} {label}
    </ListGroup.Item>
      
      {open && childList}
    </>
  );
};

export default function NestedListGroup({ nodes }) {
  return (
      <>
    {nodes.map(Root)}
    </>
  );
}
