import React, {useEffect} from 'react';
import TreatmentCard from "../treatments/treatment-card.component";
import TreatmentsDataService from "../../services/treatments/list.service";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { Tabs, Tab } from "react-bootstrap";

export default function ControlledTabs() {
    const [key, setKey] = React.useState('public');

      const [Treatments, setTreatments] = React.useState({
        id:null,
        data: [],
      });
      const [PrivateTreatments, setPrivateTreatments] = React.useState({
        id:null,
        data: [],
      });

      const [page, setPage] = React.useState(1);
      const [total, setTotal] = React.useState(0);
      const [pageSize, setPageSize] = React.useState(3);
      const [noData, setNoData] = React.useState('');

      const [searchTitle, setSearchTitle] = React.useState("");

      const [pagePrivate, setPagePrivate] = React.useState(1);
      const [totalPrivate, setTotalPrivate] = React.useState(0);
      const [pageSizePrivate, setPageSizePrivate] = React.useState(3);

      useEffect(()=>{
        retrieveTreatments();
        retrieveTreatmentsPrivate();
    }, []);

    const onChangeSearchTitle = e => {
      const searchTitle = e.target.value;
      setSearchTitle(searchTitle);
    };    
    const retrieveTreatments = (pageNumber = 1) => {
      TreatmentsDataService.findByTitle(pageNumber, searchTitle)
        .then(response => {   
          const { current_page, per_page, total } = response.data.meta;  
          console.log("masyvas" + response.data.meta)
          if(response.data.data.length !== 0){             
            setTreatments({...Treatments, data: response.data.data, id:response.data.data.length});
            setPageSize(per_page);
            setPage(current_page);     
            setTotal(total);
          }else{
            setNoData('No');
          }  
        })
        .catch(e => {
          console.log(e);
        });
    };
    const retrieveTreatmentsPrivate = (pageNumber = 1) => {
        TreatmentsDataService.findByTitle(pageNumber, searchTitle)
          .then(response => {  
            const { current_page, per_page, total } = response.data.meta;   
            if(response.data.data.length !== 0){               
              setPrivateTreatments({...PrivateTreatments, data: response.data.data, id:response.data.data.length});
              setPageSizePrivate(per_page);
              setPagePrivate(current_page);     
              setTotalPrivate(total);
            }else{
              setNoData('No');
            }     
          })
          .catch(e => {
            console.log(e);
          });
      };
    const findByTitle = () => {
      console.log("pageNumber ");
      TreatmentsDataService.findByTitle(1, searchTitle)
        .then(response => {
          const { current_page, per_page, total } = response.data.meta;   
            if(response.data.data.length !== 0){               
              setTreatments({...PrivateTreatments, data: response.data.data});
              setPageSize(per_page);
              setPage(current_page);     
              setTotal(total);
            }
            console.log(response.data.data);
        })
        .catch(e => {
          console.log(e);
        });
    };
    const findByTitle2 = () => {
      console.log("pageNumber ");
      TreatmentsDataService.findByTitle(1, searchTitle)
        .then(response => {
          const { current_page, per_page, total } = response.data.meta;   
            if(response.data.data.length !== 0){               
              setPrivateTreatments({...PrivateTreatments, data: response.data.data});
              setPageSizePrivate(per_page);
              setPagePrivate(current_page);     
              setTotalPrivate(total);
            }
            console.log(response.data.data);
        })
        .catch(e => {
          console.log(e);
        });
    };
    return (
        <div>
          {console.log(Treatments)}
        {Treatments.data.length === 0 && noData === ''?(        
              <Spinner></Spinner>
            ):(
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="public" title="Public">
            
          <div className="col-md-6">
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>    
      {console.log("kinta"+page)}
          <TreatmentCard key={Treatments.id} Treatments = {Treatments.data} ></TreatmentCard>
          <div class="d-flex justify-content-center mt-2">
        <Pagination 
        className="my-3"
        activePage={page} 
        totalItemsCount={total}
        itemsCountPerPage={pageSize}
        onChange={(pageNumber)=>retrieveTreatments(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
      
          </Tab>
          <Tab eventKey="private" title="Private">
          <div className="col-md-6">
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle2}
            >
              Search
            </button>
          </div>
        </div>
      </div> 
      {console.log("kinta"+page)}  
          <TreatmentCard Treatments = {PrivateTreatments.data} ></TreatmentCard>
          <div class="d-flex justify-content-center mt-2">
        <Pagination 
        className="my-3"
        activePage={pagePrivate} 
        totalItemsCount={totalPrivate}
        itemsCountPerPage={pageSizePrivate}
        onChange={(pageNumber)=>retrieveTreatmentsPrivate(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        activeLinkClass="bg-dark"
        firstPageText="First"
        lastPageText="Last"
        ></Pagination> 
      </div>
          </Tab>
          
        </Tabs>
            )}
            </div>
      );
}