import React, { useEffect } from 'react';
import DrugsDataService from "../../services/drugs/list.service";
import DocViewer from "./doc-viewer-modal.component";
import DrugInfo from "./info-modal.component";
import DrugsTable from "./table.component";
import Spinner from "../layout/spinner.component";
import ErrorBoundary from "../layout/error.component";
import Pagination from "react-js-pagination";
import { BsInfoCircle, BsEye, BsDownload } from "react-icons/bs";

export default function DrugsList() {

  const initialDrugState = {  
    id: null,  
    name: "",
    substance: "",
    ATC:"",
    strength:"",
    form:"",
    package:"",
    package_description:"",
    registration:"",
  };

  const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'substance',  
    text: 'Veiklioji',  
    sort: true  },  
  { dataField: 'ATC',  
    text: 'ATC',  
    sort: true  },  
  { dataField: 'strength',  
    text: 'Stiprumas',  
    sort: true },  
  {  
    dataField: 'form',  
    text: 'Forma',  
    sort: true  
  }, {  
    dataField: 'package',  
    text: 'Pakuotė',  
    sort: true },
 {
    text: 'Veiksmai',
    dataField: 'Actions',
    editable: false 
 }];

  const [drug, setDrug] = React.useState(initialDrugState);

  const [noData, setNoData] = React.useState('');
  const [error, setError] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [docs, setDocs] = React.useState('');
   
  const [searchTitle, setSearchTitle] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  const handleCloseInfo = () => {;
    setInfo(false);
  };
  const [drugs, setDrugs] = React.useState([]);
  
  const retrieveDrugs = (pageNumber = 1) => {
    DrugsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        const { current_page, per_page, total } = response.data.meta;      
        if(response.data.data.length !== 0){
          setDrugs(response.data.data);
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);     
        }else{
          setNoData("No");
        }   
      })
      .catch(e => {
        setError(true);
        console.log(e);
      });
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(retrieveDrugs, []);

  const GetActionFormat = (row) =>{
    
    return (
      <td className="table-col">
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ setDrug(row); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            {row.link!==null?(
              <>
              <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){
                setView(true);
                const docs = row.link;
                setDocs(docs);
                }}>
                <BsEye/>
            </button>
            <a type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" href={row.link} size="sm">
                <BsDownload/>
            </a>
            </>
            ):('')}
            
            
        </td>
    );
};
const findByTitle = () => {
  DrugsDataService.findByTitle(1, searchTitle)
    .then(response => {
      const { current_page, per_page, total } = response.data.meta;          
        
          setDrugs(response.data.data);
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};
  return (
    <div>
      {error?<ErrorBoundary/>:''}
      <div className="mb-2 ml-4"><h2>Vaistai</h2></div>
      {drugs?(
      drugs.length === 0 && noData === ''?(        
        <Spinner></Spinner>
      ):( 
        <div>        
        <div className="d-flex justify-content-between">
        <div className="mb-3">          
    </div>
          <div className="col-md-6">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ieškoti pagal pavadinimą, veikliąją medžiagą ar ATC"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Ieškoti
            </button>
          </div>
        </div>
      </div> 
    </div>       
      <div className="container">
      <DrugsTable key={"drugs"} columns ={columns} drugs = {drugs} GetActionFormat={GetActionFormat} rowNumber={(page*5-5)}></DrugsTable>

      { info &&<DrugInfo info = {info} drug = {drug} handleCloseInfo={handleCloseInfo}></DrugInfo> }  
      {view&&<DocViewer view={view} setDocs = {setDocs} setView={setView} docs={docs} />}
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDrugs(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="Pradžia"
        lastPageText="Pabaiga"
        ></Pagination> 
      </div>
         
  </div> </div>  )
    ):(<div>
      <br />
      <p>Some Went Wrong...</p>
    </div>)
      
    }</div>    
    
  );
}