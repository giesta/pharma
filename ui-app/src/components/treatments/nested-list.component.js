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
import { ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
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
      <div key={`leaf-form-drug-${idx}`}>
        <ListGroup.Item 
        style={leaf2}
        key={`leaf-drug-${idx}`}        
      >
        <FaMedrt key={"medrt__"+idx} /> 
        {label}
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-download-1">Peržiūrėti informaciją apie vaistą</Tooltip>}
          >
        <a key={"button__"+idx} type="button" className="btn link_info btn-sm ts-buttom" size="sm" onClick={function(event){ setCurrentDrug(drug); setShow(true)}}>
            <FaInfoCircle/>
        </a></OverlayTrigger>
        {drug.link!==null?(
            <>
            <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-download-1">Peržiūrėti informacinį lapelį</Tooltip>}
          >
            <a key={"button_"+idx} type="button" className="btn btn-sm link_info ts-buttom" onClick={
              function(event){
                setView(true);
                setDocs(drug.link);
                }} size="sm">
            <FaEye key={"eye__"+idx}/>
        </a></OverlayTrigger>
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-download-1">Parsisiųsti informacinį lapelį</Tooltip>}
          >
            <a key={"button"+idx} type="button" className="btn link_info btn-sm ts-buttom" href={drug.link} size="sm"><FaFileDownload/></a>
           </OverlayTrigger> 
           </>
        ):('')}
         
        </ListGroup.Item >
        { show &&<DrugInfo key={"drug_info"+idx} info = {show} drug = {currentDrug} handleCloseInfo={handleClose}></DrugInfo> } 
        {view&&<DocViewer key={"viewer"+idx} view={view} setDocs = {setDocs} setView={setView} docs={docs} />}
        </div>
    );
  };

const Leaf = ({label, children }, idx) => {
    const [open, setOpen] = useState(false);
  const childList =children.map(Leaf2);
  return (
     <div key={`leaf-form-drug-${idx}`}>
    <ListGroup.Item 
      style={leaf}
      action
      key={`leaf-form-${idx}`}
      onClick={() => setOpen(!open)}
    >
      {open ? <FaAngleDown key={"icons_down_third"+idx} /> : <FaAngleRight key={"icons_right_third_"+idx} />}{" "}
        { <FaVial />} {label}
    </ListGroup.Item >
    {open && childList}
    </div> 
  );
};

const Branch = ({ label, children }, idx) => {
  const [open, setOpen] = useState(false);
  const childList = children.map(Leaf);
  return (
    <div key={`leaf-form-strength-${idx}`}>
      <ListGroup.Item 
        style={branch}
        action
        onClick={() => setOpen(!open)}
        key={`branch-strength-${idx}`}
      >
        {open ? <FaAngleDown key={"icons_down_"+idx} /> : <FaAngleRight key={"icons_right_second_"+idx} />}{" "}
        {<FaPills key={"icons_pills_"+idx} />} {label}
      </ListGroup.Item >
      {open && childList}
    </div>
  );
};

const Root = ({ label, children }, idx) => {
  const [open, setOpen] = useState(false);
  const childList = children.map(Branch);
  return (
    <div key={`leaf-form-substance-${idx}`}>
    <ListGroup.Item 
    key={`root-name-${idx}`} 
    action 
    onClick={() => setOpen(!open)}>
        {open ? <FaAngleDown key={"icons_left_"+idx} /> : <FaAngleRight key={"icons_right_"+idx} />}{" "}
        { <FaBriefcaseMedical key={"icons_medical_"+idx} />} {label}
    </ListGroup.Item>
      
      {open && childList}
    </div>
  );
};

export default function NestedListGroup({ nodes }) {
  return (
      <>
    {nodes.map(Root)}
    </>
  );
}
