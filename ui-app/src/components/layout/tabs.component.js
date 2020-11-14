import React, {useEffect } from 'react';
import TreatmentCard from "../treatments/treatment-card.component";
import TreatmentsDataService from "../../services/treatments/list.service";
import Spinner from "../layout/spinner.component";

import { Tabs, Tab } from "react-bootstrap";

export default function ControlledTabs() {
    const [key, setKey] = React.useState('public');

      const [Treatments, setTreatments] = React.useState({
        data: [],
      });
      const [PrivateTreatments, setPrivateTreatments] = React.useState({
        data: [],
      });
      useEffect(()=>{
        retrieveTreatments();
        retrieveTreatmentsPrivate();
    }, []);
    
    const retrieveTreatments = () => {
      TreatmentsDataService.getAllPublic()
        .then(response => {    
          if(response.data.data.length !== 0){
            setTreatments({...Treatments, data: response.data.data});
          }      
        })
        .catch(e => {
          console.log(e);
        });
    };
    const retrieveTreatmentsPrivate = () => {
        TreatmentsDataService.getAll()
          .then(response => {    
            if(response.data.data.length !== 0){
              setPrivateTreatments({...PrivateTreatments, data: response.data.data});
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
          </Tab>
          <Tab eventKey="private" title="Private">
          <TreatmentCard Treatments = {getPrivate().data} ></TreatmentCard>
          </Tab>
        </Tabs>
            )}
            </div>
      );
}