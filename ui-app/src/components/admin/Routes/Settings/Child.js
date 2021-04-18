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
  const [loadingLinks, setLoadingLinks] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const drugsReports = () => {        
      DrugsDataService.reports()
      .then(response => {
        if(response.data.success){
          if(response.data.data.updated_at !== null){
            setDrugsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.updated_at));
          }else{
            setDrugsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.created_at));
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
        if(response.data.data.created_at !== null){         
          setSymptomsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.created_at));
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
      if(response.data.data.created_at !== null){
        setDiseasesUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.created_at));
      }           
    }        
  })
  .catch(e => {
    console.log(e);
  });   
};
  useEffect(drugsReports,[]);

  const saveDrugs = () => {
    setLoading(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    
    if(drugs.length > 0){ 
      console.log(data);     
      DrugsDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data + " naujų elementų ");
        setDrugsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateDrugs = () => {
    setLoading(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    data.append('_method', 'PUT');
    if(drugs.length > 0){     
      DrugsDataService.create(data)
      .then(response => {
        setText("Atnaujinta " + response.data.data.updated + " vaistų, pridėta " + response.data.data.added_substances + " veikliųjų medžiagų ir " + response.data.data.added_drugs + " vaistų");
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
        setLoadingSymptoms(false);
        setText("Pridėta " + response.data.data + " naujų elementų ");
        setSymptomsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateSymptoms = () => {
    setLoadingSymptoms(true);
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    data.append('_method', 'PUT');
    if(symptoms.length > 0){   
      SymptomsDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data.added + " naujų elementų");
        setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingSymptoms(false);
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
        setLoadingDiseases(false);
        setText("Pridėta " + response.data.data + " naujų elementų");
        setDiseasesUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const updateDiseases = () => {
    setLoadingDiseases(true);
    const data = new FormData();
    data.append('diseases', JSON.stringify(diseases));
    data.append('_method', 'PUT');
    if(diseases.length > 0){ 
      console.log(data);     
      DiseasesDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data.added + " naujų elementų");
        setDiseasesUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingDiseases(false);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  const handleOnDropDrugs = (data) => {
    setDrugs(data);
  };
  const handleOnDropSymptoms = (data) => {
    setSymptoms(data);
  };
  const handleOnDropDiseases = (data) => {
    setDiseases(data);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const updateLinks = () => {
    setLoadingLinks(true);
    DrugsDataService.scrap()
      .then(response => {
        setText("Nuorodos atnaujintos sėkmingai");
        setLoadingLinks(false);
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
              <div className="kanban-name">Nustatymai</div>                
            </div>
            
          </div>
        </section>
        <section className="kanban__main">          
          <div className="ml-1 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={drugsUpdated===""?("Importuoti vaistus"):("Atnaujinti vaistus") } 
              updated ={drugsUpdated}
              loading = {loading}
              disabled={disabled}
              title="Įkelti vaistus" 
              save={drugsUpdated===""?(saveDrugs):(updateDrugs)} 
              handleOnDrop={handleOnDropDrugs} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
        
          <div className="ml-1 mt-4 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={symptomsUpdated===""?("Importuoti simptomus"):("Atnaujinti simptomus") } 
              updated={symptomsUpdated}
              title="Įkelti simptomus" 
              loading = {loadingSymptoms}
              save={symptomsUpdated===""?(saveSymptoms):(updateSymptoms)} 
              handleOnDrop={handleOnDropSymptoms} 
              handleOnError={handleOnError} 
              handleOnRemoveFile={handleOnRemoveFile}
            />
          </div>
        
          <div className="ml-1 mt-4 kanban__main-wrapper">
            <UploadCSV 
              buttonTitle={diseasesUpdated===""?("Importuoti ligas"):("Atnaujinti ligas") }
              updated={diseasesUpdated}
              title="Įkelti ligas" 
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
                  {loadingLinks && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}Atnaujinti vaistų nuorodas
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
