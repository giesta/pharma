import React, { useCallback, useEffect } from 'react';

import TreatmentsDataService from "../services/treatments/list.service";
import UserService from "../services/user.service";
import TreatmentCard from "./treatments/treatment-card.component";
import {CardDeck, CardColumns } from "react-bootstrap";

export default function HomePage() {
  const initialTreatmentState = {  
    id: null,  
    title: "",
    description: "",
    algorithm: "",
    disease_id: "",
    disease: null
  };

  const [treatment, setTreatment] = React.useState(initialTreatmentState);
  const [noData, setNoData] = React.useState('');
  const [Treatments, setTreatments] = React.useState({
    data: [],
  });
  useEffect(()=>{
    retrieveTreatments();
}, []);

const retrieveTreatments = () => {
  TreatmentsDataService.getAll()
    .then(response => {   
      //console.log(response.data.data)     
      if(response.data.data.length !== 0){
        setTreatments({...Treatments, data: response.data.data});
      }else{
        setNoData("No data");
      }       
    })
    .catch(e => {
      console.log(e);
    });
};

    return (
      <div className="container">
        <header>
          <h3>
              Home
          </h3>
        </header>
        <CardDeck>        
          {Treatments.data.map((field)=>
          <div class="col-xs-6 col-md-4">
             {TreatmentCard(field)}
             </div>
      )  
  }  
  </CardDeck>   
      </div>
    );
}