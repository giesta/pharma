import React, {useEffect } from 'react';
import TreatmentCard from "../treatments/treatment-card.component";
import TreatmentsDataService from "../../services/treatments/list.service";
import Spinner from "../layout/spinner.component";
import Pagination from "react-js-pagination";
import { Tabs, Tab } from "react-bootstrap";

export default function ControlledTabs() {
    const [key, setKey] = React.useState('public');

      const [Treatments, setTreatments] = React.useState({
        data: [],
      });
      const [PrivateTreatments, setPrivateTreatments] = React.useState({
        data: [],
      });

      const [page, setPage] = React.useState(1);
      const [total, setTotal] = React.useState(0);
      const [pageSize, setPageSize] = React.useState(3);

      const [pagePrivate, setPagePrivate] = React.useState(1);
      const [totalPrivate, setTotalPrivate] = React.useState(0);
      const [pageSizePrivate, setPageSizePrivate] = React.useState(3);

      useEffect(()=>{
        retrieveTreatments();
        retrieveTreatmentsPrivate();
    }, []);
    
    const retrieveTreatments = (pageNumber = 1) => {
      TreatmentsDataService.getAllPublic(pageNumber)
        .then(response => {   
          const { current_page, per_page, total } = response.data.meta;  
          console.log("masyvas" + response.data.meta)
          if(response.data.data.length !== 0){             
            setTreatments({...Treatments, data: response.data.data});
            setPageSize(per_page);
            setPage(current_page);     
            setTotal(total);
          }      
        })
        .catch(e => {
          console.log(e);
        });
    };
    const retrieveTreatmentsPrivate = (pageNumber = 1) => {
        TreatmentsDataService.getAllPaginate(pageNumber)
          .then(response => {  
            const { current_page, per_page, total } = response.data.meta;   
            if(response.data.data.length !== 0){               
              setPrivateTreatments({...PrivateTreatments, data: response.data.data});
              setPageSizePrivate(per_page);
              setPagePrivate(current_page);     
              setTotalPrivate(total);
            }      
          })
          .catch(e => {
            console.log(e);
          });
      };
      const getPrivate = () =>{
          return PrivateTreatments;
      }
      const getPublic = () =>{
        return Treatments;
    }
    return (
        <div>
          {console.log(Treatments)}
        {Treatments.data.length===0?(        
              <Spinner></Spinner>
            ):(
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="public" title="Public">
          <TreatmentCard Treatments = {getPublic().data} ></TreatmentCard>
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
          <TreatmentCard Treatments = {getPrivate().data} ></TreatmentCard>
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