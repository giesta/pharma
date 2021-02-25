import React, { useEffect } from 'react';
import SymptomsDataService from "../../services/diseases/symptoms.service";

export default function scrap() {

  const scrapSymptoms = () => {
       
    SymptomsDataService.scrap()
      .then(response => {
        console.log("--------------Veikia----------");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    };

  
    return (
      <>
      <div className="container">
        <div className="row">
        <div className="col-6 col-sm-3">
          <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){scrapSymptoms()}}>
              Scrap
          </button>
          
    </div>
          
        </div>
      </div>
      </>
    );
  
}