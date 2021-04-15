import React, {useEffect} from 'react';
import TreatmentCard from "../treatments/treatment-card.component";
import TreatmentsDataService from "../../services/treatments/list.service";
import Spinner from "../layout/spinner.component";
import AuthService from "../../services/auth.service";
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
      const user = AuthService.getCurrentUser();

      const [searchTitle, setSearchTitle] = React.useState("");

      const [pagePrivate, setPagePrivate] = React.useState(1);
      const [totalPrivate, setTotalPrivate] = React.useState(0);
      const [pageSizePrivate, setPageSizePrivate] = React.useState(3);

      
      
      
    const onChangeSearchTitle = e => {
      const searchTitle = e.target.value;
      setSearchTitle(searchTitle);
    };    
    const retrieveTreatments = (pageNumber = 1) => {
      TreatmentsDataService.findByTitlePublic(pageNumber, searchTitle)
        .then(response => {   
          const { current_page, per_page, total } = response.data.meta
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
    useEffect(retrieveTreatments, []);
    const retrieveTreatmentsPrivate = (pageNumber = 1) => {
        TreatmentsDataService.findByTitlePrivate(pageNumber, searchTitle)
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
      TreatmentsDataService.findByTitlePublic(1, searchTitle)
        .then(response => {
          const { current_page, per_page, total } = response.data.meta;              
          setTreatments({...Treatments, data: response.data.data});
          setPageSize(per_page);
          setPage(current_page);     
          setTotal(total);
          if(response.data.data.length === 0){               
            setNoData('No');
          }
        })
        .catch(e => {
          console.log(e);
        });
    };
    const findByTitle2 = () => {
      TreatmentsDataService.findByTitlePrivate(1, searchTitle)
        .then(response => {
          const { current_page, per_page, total } = response.data.meta;
          setPrivateTreatments({...PrivateTreatments, data: response.data.data});
          setPageSizePrivate(per_page);
          setPagePrivate(current_page);     
          setTotalPrivate(total);   
          if(response.data.data.length === 0){               
            setNoData('No');
          }
        })
        .catch(e => {
          console.log(e);
        });
    };
    useEffect(retrieveTreatmentsPrivate, []);
    return (
        <div>
        {Treatments.data.length === 0 && noData === ''?(        
              <Spinner></Spinner>
            ):(
        <Tabs
          unmountOnExit={true}
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="public" title="Public" >
            
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
          <TreatmentCard key={Treatments.id} Treatments = {Treatments.data} ></TreatmentCard>
          <div className="d-flex justify-content-center mt-2">
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
      {(user !== null)?(<Tab eventKey="private" title="Private">
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
          <TreatmentCard Treatments = {PrivateTreatments.data} ></TreatmentCard>
          <div className="d-flex justify-content-center mt-2">
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
          </Tab>):('')
          }
          
          
        </Tabs>
            )}
            </div>
      );
}