import React, { useEffect } from "react";
import UploadCSV from "../../../drugs/uploadCSV.component";
import DateParser from "../../../../services/parseDate.service";
import DrugsDataService from "../../../../services/drugs/list.service";
import SymptomsDataService from "../../../../services/diseases/symptoms.service";
import DiseasesDataService from "../../../../services/diseases/list.service";
import { Alert } from "react-bootstrap";

function Child()  {
  const [drugs, setDrugs] = React.useState([]);
  const [symptoms, setSymptoms] = React.useState([]);
  const [text, setText] = React.useState("");
  const [drugsUpdated, setDrugsUpdated] = React.useState("");
  const [symptomsUpdated, setSymptomsUpdated] = React.useState("");
  const [diseasesUpdated, setDiseasesUpdated] = React.useState("");

  const drugsReports = () => {        
      DrugsDataService.reports()
      .then(response => {
        if(response.data.success){
          if(response.data.data.updated_at !== null){
            setDrugsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
          }else{
            setDrugsUpdated("Last update " + DateParser.getParsedDate(response.data.data.created_at));
          }           
        } 
        symptomsReports(); 
        diseasesReports();      
      })
      .catch(e => {
        console.log(e);
      });   
  };
  const symptomsReports = () => {        
    SymptomsDataService.reports()
    .then(response => {
      if(response.data.success){
        if(response.data.data.updated_at !== null){
          setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        }else{
          setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.data.created_at));
        }           
      }        
    })
    .catch(e => {
      console.log(e);
    });   
};
const diseasesReports = () => {        
  DiseasesDataService.reports()
  .then(response => {
    if(response.data.success){
      if(response.data.data.updated_at !== null){
        setDiseasesUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
      }else{
        setDiseasesUpdated("Last update " + DateParser.getParsedDate(response.data.data.created_at));
      }           
    }        
  })
  .catch(e => {
    console.log(e);
  });   
};
  useEffect(drugsReports,[]);

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
        setText("Added " + response.data.data + " new items ");
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
        setText("Added " + response.data.data + " new items ");
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const saveDiseases = () => {
    console.log(symptoms)
    const data = new FormData();
    data.append('diseases', JSON.stringify(symptoms));
    if(symptoms.length > 0){ 
      console.log(data);     
      DiseasesDataService.create(data)
      .then(response => {
        console.log("--------------Veikia ligos----------");
        console.log(response.data);
        setText("Added " + response.data.data + " new items ");
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
          <div>{text!==""?(<Alert variant={'success'}>{text}</Alert>):('')}</div>
          <div className="kanban__nav-wrapper">          
            <div className="kanban__nav-name">
              <div className="kanban-name">Studio Settings</div>                
            </div>
            
          </div>
        </section>
        <section className="kanban__main">          
          <div className="ml-1 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={drugsUpdated===""?("Import Diseases"):("Update Diseases") } 
              updated ={drugsUpdated}
              title="Upload Drugs" 
              save={saveDrugs} 
              handleOnDrop={handleOnDropDrugs} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
        
          <div className="ml-1 mt-4 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={symptomsUpdated===""?("Import Symptoms"):("Update Symptoms") } 
              updated={symptomsUpdated}
              title="Upload Symptoms" 
              save={saveSymptoms} 
              handleOnDrop={handleOnDropSymptoms} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
        
          <div className="ml-1 mt-4 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={diseasesUpdated===""?("Import Diseases"):("Update Diseases") }
              updated={diseasesUpdated}
              title="Upload Diseases" 
              save={saveDiseases} 
              handleOnDrop={handleOnDropSymptoms} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }


export default Child;
