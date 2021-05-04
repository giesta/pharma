import React, { useEffect } from 'react';
import DiagramsDataService from "../../services/diagrams/list.service";
import { useHistory } from "react-router-dom";
import DiagramDelete from "../delete-modal.component";
import DiagramInfo from "./info-modal.component";
import DiagramsTable from "./table.component";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { BsPlus, BsPen, BsTrash, BsInfoCircle} from "react-icons/bs";
import { removeError } from "../../js/actions/index";
import store from "../../js/store/index";
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ErrorBoundary from "../layout/error.component";


export default function DiagramsList() {

  const initialDiagramState = {  
    id: null,  
    name: "",
  };
  
  const [diagram, setDiagram] = React.useState(initialDiagramState);
  const [diagrams, setDiagrams] = React.useState([]);
  const [elements, setElements] = React.useState([]);
  const history = useHistory();
  const [confirm, setConfirm] = React.useState(false);
  const [info, setInfo] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  const [noData, setNoData] = React.useState('');

  const [searchTitle, setSearchTitle] = React.useState("");

  const {dispatch} = store;

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setError(false);
    dispatch(removeError());
  }
  const handleCloseInfo = () => {
    newDiagram();
    setInfo(false);
    setError(false);
    dispatch(removeError());
  };  
  const retrieveDiagrams = (pageNumber = 1) => {
    DiagramsDataService.findByTitle(pageNumber, searchTitle)
      .then(response => {  
        const { current_page, per_page, total } = response.data.meta;        
        if(response.data.data.length !== 0){
          setDiagrams(response.data.data);
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);          
        }else{
          setDiagrams(response.data.data);
          setNoData('No Data');
        }       
      })
      .catch(e => {
        console.log(e);
        setError(true);
      });
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(retrieveDiagrams, []);
  const findByTitle = () => {
    DiagramsDataService.findByTitle(1, searchTitle)
      .then(response => {
        const { current_page, per_page, total } = response.data.meta;          
          if(response.data.data.length !== 0){
            setDiagrams(response.data.data);
            setPageSize(per_page);
            setPage(current_page);     
            setTotal(total);          
          }
      })
      .catch(e => {
        console.log(e);
        setError(true);
      });
  };
  
  const GetActionFormat = (row) =>{    
    return (
      <td className="table-col">
        {error?<ErrorBoundary/>:''}
          <button type="button" className="btn btn-outline-info btn-sm ts-buttom" size="sm" onClick={
              function(event){ 
                setDiagram(row);
                var arr = row.nodes.concat(row.edges);
                var items = arr.map((el)=>{
                  if(el.source === undefined){
                    var item = {id:el.item_id, data:{label:el.label, style:{backgroundColor:el.background}}, style:{backgroundColor:el.background}, type:el.type, position:{x:parseInt(el.x), y:parseInt(el.y)}};
                    return item;
                  }else{
                    var item2 = {id:el.item_id, data:{label:el.label, style:{stroke:el.stroke}, animated:el.animated===1?true:false}, animated:el.animated===1?true:false, arrowHeadType:el.arrow, label:el.label, style:{stroke:el.stroke}, type:el.type, source:el.source, target:el.target};
                    return item2;
                  }                  
              });
                setElements(items); setInfo(true)}}>
                <BsInfoCircle></BsInfoCircle>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-buttom" size="sm" onClick={
              function(event){ 
                var arr = row.nodes.concat(row.edges);                
                var items = arr.map((el)=>{
                  if(el.source === undefined){
                    var item = {id:el.item_id, data:{label:el.label, style:{backgroundColor:el.background}}, style:{backgroundColor:el.background}, type:el.type, position:{x:parseInt(el.x), y:parseInt(el.y)}};
                    return item;
                  }else{
                    var item2 = {id:el.item_id, data:{label:el.label, style:{stroke:el.stroke}, animated:el.animated===1?true:false}, animated:el.animated===1?true:false, arrowHeadType:el.arrow, label:el.label, style:{stroke:el.stroke}, type:el.type, source:el.source, target:el.target};
                    return item2;
                  }                  
              });
                setElements(items);setDiagram(row);
                history.push({ 
                  pathname: "/diagrams/update",
                  state: { elements: items, diagram: row }
                 });
                }}>
                <BsPen></BsPen>
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-buttom" size="sm"onClick={
              function(event){ setDiagram(row); setConfirm(true)}}>
            <BsTrash></BsTrash>
            </button>
        </td>
    );
};

const columns = [{  
    dataField: 'no',  
    text: 'Nr' },  
  {  
    dataField: 'name',  
    text: 'Pavadinimas',  
    sort:true}, {  
    dataField: 'created_at',  
    text: 'Sukurta',  
    sort: true  }, 
    {  
      dataField: 'updated_at',  
      text: 'Atnaujinta',  
      sort: true  },  
    {
        text: 'Veiksmai',
        dataField: 'Actions',
        editable: false 
     } 
];
const deleteItem = (id) => {
  DiagramsDataService.remove(id)
    .then(() => {
      if(diagrams.length > 1){
        retrieveDiagrams(page);
      }else if(page > 1){
        retrieveDiagrams(page - 1);
      }
      else{
        retrieveDiagrams();
      }
      
      handleCloseConfirm();
    })
    .catch(e => {
      setError(true);
      console.log(e);
    });
};

const newDiagram = () => {
  setDiagram(initialDiagramState);
};


  return (
    <div>
      <div className="mb-4"><h2>Diagramos</h2></div>
      {diagrams?(
      diagrams.length===0 && noData===''?(        
        <Spinner></Spinner>
      ):(  
        <div>
          <div className="mb-3">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="button-rate-1">Sukurti naują</Tooltip>}
          >
          <Link to="/diagrams/create" className="btn btn-outline-success btn-sm ts-buttom" size="sm">
              <BsPlus></BsPlus>
          </Link>
          </OverlayTrigger>
          
    </div>
        <div className="col-md-6 float-right">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ieškoti pagal pavadinimą"
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
      <div className="container">
      <DiagramsTable 
        columns ={columns} 
        diagrams={diagrams} 
        GetActionFormat={GetActionFormat} 
        rowNumber={(page*5-5)}
      >
      </DiagramsTable>
      { info &&
      <DiagramInfo 
        name={diagram.name} 
        elements={elements} 
        info = {info} 
        handleCloseInfo={handleCloseInfo}
      >
      </DiagramInfo> } 
      { confirm &&
      <DiagramDelete 
        id={diagram.id} 
        name={"diagramą "+diagram.name} 
        deleteItem={deleteItem} 
        handleCloseConfirm={handleCloseConfirm} 
        confirm={confirm}
        >
      </DiagramDelete> }
      <div>
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveDiagrams(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="Pradžia"
        lastPageText="Pabaiga"
        ></Pagination> 
      </div>
  </div>
  </div>  )
    ):(<div>
      <br />
      <p>No Data...</p>
    </div>)
      
    }</div>
    
    
  );
}