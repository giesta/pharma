import React from "react";
import UploadCSV from "../../../drugs/uploadCSV.component";
import DrugsDataService from "../../../../services/drugs/list.service";
import SymptomsDataService from "../../../../services/diseases/symptoms.service";

function Child()  {
  const [drugs, setDrugs] = React.useState([]);
  const [symptoms, setSymptoms] = React.useState([]);

  const saveDrugs = () => {
    console.log(drugs)
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    if(drugs.length > 0){ 
      console.log(data);     
      DrugsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia----------");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const saveSymptoms = () => {
    console.log(symptoms)
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    if(symptoms.length > 0){ 
      console.log(data);     
      SymptomsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia simptomai----------");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const handleOnDropDrugs = (data) => {
    console.log('---------------------------');
    console.log(data);
    setDrugs(data);
    console.log('---------------------------');
  };
  const handleOnDropSymptoms = (data) => {
    console.log('---------------------------');
    console.log(data);
    setSymptoms(data);
    console.log('---------------------------');
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div className="kanban__nav-wrapper">
            <div className="kanban__nav-name">
              <div className="kanban-name">Studio Settings</div>                
            </div>
            
          </div>
        </section>
        <section className="kanban__main">          
          <div className="ml-1 kanban__main-wrapper"><UploadCSV buttonTitle="Import Drugs" title="Upload Drugs" save={saveDrugs} handleOnDrop={handleOnDropDrugs} handleOnError={handleOnError} handleOnRemoveFile={handleOnRemoveFile}/></div>
        
          <div className="ml-1 mt-4 kanban__main-wrapper"><UploadCSV buttonTitle="Import Symptoms" title="Upload Symptoms" save={saveSymptoms} handleOnDrop={handleOnDropSymptoms} handleOnError={handleOnError} handleOnRemoveFile={handleOnRemoveFile}/></div>
        </section>
      </React.Fragment>
    );
  }


export default Child;
