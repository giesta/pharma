import React, { useState } from "react";
import {
  FaAngleRight,
  FaAngleDown,
  FaPills,
  FaVial,
  FaBriefcaseMedical,
  FaMedrt,
  FaEye,
  FaFileDownload,
  FaInfoCircle
} from "react-icons/fa";
import { ListGroup} from "react-bootstrap";
import DrugInfo from "../drugs/info-modal.component";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DocViewer from "../drugs/doc-viewer-modal.component";

const leaf = { paddingLeft: "70px" };
const branch = { paddingLeft: "40px" };
const leaf2 = { paddingLeft: "100px" };

const Leaf2 = ({ drug, label }, idx) => {
    const [currentDrug, setCurrentDrug] = useState({});
    const [show, setShow] = useState(false);
    const [view, setView] = useState(false);
    const [docs, setDocs] = useState('');
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
        style={leaf2}
        key={`leaf-${idx}`}        
      >
        <FaMedrt /> 
        {label}
        <a type="button" className="btn link_info btn-sm ts-buttom" size="sm" onClick={function(event){ setCurrentDrug(drug); setShow(true)}}>
            <FaInfoCircle/>
        </a>
        {drug.link!==null?(
            <>
            
            <a type="button" className="btn btn-sm link_info ts-buttom" onClick={
              function(event){
                setView(true);
                const docs = drug.link;
                setDocs(drug.link);
                }} size="sm">
            <FaEye/>
        </a>
            <a type="button" className="btn link_info btn-sm ts-buttom" href={drug.link} size="sm"><FaFileDownload/></a>
            </>
        ):('')}
         
        </ListGroup.Item >
        { show &&<DrugInfo info = {show} drug = {currentDrug} handleCloseInfo={handleClose}></DrugInfo> } 
        {view&&<DocViewer view={view} setDocs = {setDocs} setView={setView} docs={docs} />}
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
