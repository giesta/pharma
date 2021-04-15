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
  const [diseases, setDiseases] = React.useState([]);
  const [text, setText] = React.useState("");
  const [drugsUpdated, setDrugsUpdated] = React.useState("");
  const [symptomsUpdated, setSymptomsUpdated] = React.useState("");
  const [diseasesUpdated, setDiseasesUpdated] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingSymptoms, setLoadingSymptoms] = React.useState(false);
  const [loadingDiseases, setLoadingDiseases] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [loadingLinks, setLoadingLinks] = React.useState(false);

  const drugsReports = () => {        
      DrugsDataService.reports()
      .then(response => {
        if(response.data.success){
          console.log(response.data.data.created_at);
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
        console.log(response.data.data.created_at);
        if(response.data.data.created_at !== null){         
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
      console.log(response.data.data.created_at);
      if(response.data.data.created_at !== null){
        setDiseasesUpdated("Last update " + DateParser.getParsedDate(response.data.data.created_at));
      }           
    }  
    console.log(diseasesUpdated);       
  })
  .catch(e => {
    console.log(e);
  });   
};
  useEffect(drugsReports,[]);

  const saveDrugs = () => {
    console.log(drugs);
    setLoading(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    
    if(drugs.length > 0){ 
      console.log(data);     
      DrugsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia----------");
        console.log(response.data);
        setText("Added " + response.data.data + " new items ");
        setDrugsUpdated("Last update " + DateParser.getParsedDate(response.data.updated_at));
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateDrugs = () => {
    //console.log(drugs)
    setLoading(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    data.append('_method', 'PUT');
    if(drugs.length > 0){ 
      console.log(data);     
      DrugsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia atnaujinimas----------");
        console.log(response.data);
        setText("Updated " + response.data.data.updated + " drugs, added " + response.data.data.added_substances + " substances and " + response.data.data.added_drugs + " drugs");
        setDrugsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const saveSymptoms = () => {
    console.log(symptoms)
    setLoadingSymptoms(true);
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    if(symptoms.length > 0){ 
      console.log(data);     
      SymptomsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia simptomai----------");
        console.log(response.data);
        setLoadingSymptoms(false);
        setText("Added " + response.data.data + " new items ");
        setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateSymptoms = () => {
    //console.log(drugs)
    setLoadingSymptoms(true);
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    data.append('_method', 'PUT');
    if(symptoms.length > 0){ 
      console.log(data);     
      SymptomsDataService.create(data)
      .then(response => {
        console.log("--------------Veikia atnaujinimas----------");
        console.log(response.data);
        setText("Added " + response.data.data.added + " new items and updated " + response.data.data.updated + " items");
        setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingSymptoms(false);
        console.log(symptomsUpdated);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const saveDiseases = () => {
    setLoadingDiseases(true);
    console.log(diseases)
    const data = new FormData();
    data.append('diseases', JSON.stringify(diseases));
    if(diseases.length > 0){ 
      console.log(data);     
      DiseasesDataService.create(data)
      .then(response => {
        console.log("--------------Veikia ligos----------");
        console.log(response.data);
        setLoadingDiseases(false);
        setText("Added " + response.data.data + " new items ");
        setDiseasesUpdated("Last update " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateDiseases = () => {
    //console.log(drugs)
    setLoadingDiseases(true);
    const data = new FormData();
    data.append('diseases', JSON.stringify(diseases));
    data.append('_method', 'PUT');
    if(diseases.length > 0){ 
      console.log(data);     
      DiseasesDataService.create(data)
      .then(response => {
        console.log("--------------Veikia atnaujinimas----------");
        console.log(response.data);
        setText("Added " + response.data.data.added + " new items and updated " + response.data.data.updated + " items");
        setDiseasesUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingDiseases(false);
        console.log(diseasesUpdated);
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
  const handleOnDropDiseases = (data) => {
    console.log('---------------------------');
    console.log(data);
    setDiseases(data);
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

  const updateLinks = () => {
       console.log("tik");
    DrugsDataService.scrap()
      .then(response => {
        console.log("--------------Veikia----------");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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
              buttonTitle={drugsUpdated===""?("Import Drugs"):("Update Drugs") } 
              updated ={drugsUpdated}
              loading = {loading}
              disabled={disabled}
              title="Upload Drugs" 
              save={drugsUpdated===""?(saveDrugs):(updateDrugs)} 
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
              loading = {loadingSymptoms}
              save={symptomsUpdated===""?(saveSymptoms):(updateSymptoms)} 
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
              loading = {loadingDiseases}
              save={diseasesUpdated===""?(saveDiseases):(updateDiseases)} 
              handleOnDrop={handleOnDropDiseases} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
          {drugsUpdated!==""?(
          <div className="ml-1 mt-4 kanban__main-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-6 col-sm-3">
                  <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={()=>updateLinks()}>
                    Update Drugs Links
                  </button>          
                </div>          
              </div>
            </div>
          </div>
        ):''}
          
        </section>
      </React.Fragment>
    );
  }


export default Child;
