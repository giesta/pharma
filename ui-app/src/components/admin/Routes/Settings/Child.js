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
  const [errorText, setErrorText] = React.useState('');

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
    setDisabled(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    
    if(drugs.length > 0){ 
      console.log(data);     
      DrugsDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data + " naujų elementų ");
        setDrugsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
        setLoading(false);
        setDisabled(false);
      })
      .catch(e => {
        setLoading(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoading(false);
      setDisabled(false);
    }    
  };
  const updateDrugs = () => {
    setLoading(true);
    setDisabled(true);
    const data = new FormData();
    data.append('drugs', JSON.stringify(drugs));
    data.append('_method', 'PUT');
    if(drugs.length > 0){     
      DrugsDataService.create(data)
      .then(response => {
        setText("Atnaujinta " + response.data.data.updated + " vaistų, pridėta " + response.data.data.added_substances + " veikliųjų medžiagų ir " + response.data.data.added_drugs + " vaistų");
        setDrugsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoading(false);
        setDisabled(false);
      })
      .catch(e => {
        setLoading(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoading(false);
      setDisabled(false);
    }    
  };

  const saveSymptoms = () => {
    console.log(symptoms)
    setLoadingSymptoms(true);
    setDisabled(true);
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    if(symptoms.length > 0){ 
      console.log(data);     
      SymptomsDataService.create(data)
      .then(response => {
        setLoadingSymptoms(false);
        setDisabled(false);
        setText("Pridėta " + response.data.data + " naujų elementų ");
        setSymptomsUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        setLoadingSymptoms(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoadingSymptoms(false);
      setDisabled(false);
    }    
  };
  const updateSymptoms = () => {
    setLoadingSymptoms(true);
    setDisabled(true);
    const data = new FormData();
    data.append('symptoms', JSON.stringify(symptoms));
    data.append('_method', 'PUT');
    if(symptoms.length > 0){   
      SymptomsDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data.added + " naujų elementų");
        setSymptomsUpdated("Last update " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingSymptoms(false);
        setDisabled(true);
      })
      .catch(e => {
        setLoadingSymptoms(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoadingSymptoms(false);
      setDisabled(false);
    }     
  };
  const saveDiseases = () => {
    setLoadingDiseases(true);
    setDisabled(true);
    console.log(diseases)
    const data = new FormData();
    data.append('diseases', JSON.stringify(diseases));
    if(diseases.length > 0){ 
      console.log(data);     
      DiseasesDataService.create(data)
      .then(response => {
        setLoadingDiseases(false);
        setDisabled(false);
        setText("Pridėta " + response.data.data + " naujų elementų");
        setDiseasesUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.updated_at));
      })
      .catch(e => {
        setLoadingDiseases(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoadingDiseases(false);
      setDisabled(false);
    }     
  };
  const updateDiseases = () => {
    setLoadingDiseases(true);
    setDisabled(true);
    const data = new FormData();
    data.append('diseases', JSON.stringify(diseases));
    data.append('_method', 'PUT');
    if(diseases.length > 0){      
      DiseasesDataService.create(data)
      .then(response => {
        setText("Pridėta " + response.data.data.added + " naujų elementų");
        setDiseasesUpdated("Paskutinis atnaujinimas " + DateParser.getParsedDate(response.data.data.updated_at));
        setLoadingDiseases(false);
        setDisabled(false);
      })
      .catch(e => {
        setLoadingDiseases(false);
        setDisabled(false);
        console.log(e);
      });
    }else{
      setErrorText('Nurodytas failas tuščias arba nenurodytas')
      setLoadingDiseases(false);
      setDisabled(false);
    }    
  };
  const handleOnDropDrugs = (data) => {
    if(data[0].data['ATC kodas']===undefined&&
      data[0].data['Preparato (sugalvotas) pavadinimas']===undefined&&
      data[0].data['Stiprumas']===undefined&&
      data[0].data['Farmacinė forma']===undefined&&
      data[0].data['(pakuotės) Pakuotės tipas']===undefined&&
      data[0].data['(pakuotės) Aprašymas']===undefined&&
      data[0].data['Veiklioji (-osios) medžiaga (-os)']===undefined&&
      data[0].data['Stadija']===undefined&&
      data[0].data['Pavadinimas anglų kalba']===undefined
    ){
      setErrorText('Neatitinka duomenys reikalingos struktūros!')
    }else{
      setErrorText('');
      setDrugs(data);
    }    
  };
  const handleOnDropSymptoms = (data) => {
    if(data[0].data['Pavadinimas']===undefined){
      setErrorText('Neatitinka duomenys reikalingos struktūros!')
    }else{
      setErrorText('');
      setSymptoms(data);
    }    
  };
  const handleOnDropDiseases = (data) => {
    if(data[0].data['Pavadinimas']===undefined){
      setErrorText('Neatitinka duomenys reikalingos struktūros!')
    }else{
      setErrorText('');
      setDiseases(data);
    }    
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    setErrorText('');
    console.log(data);
  };

  const updateLinks = () => {
    setLoadingLinks(true);
    setDisabled(true);
    DrugsDataService.scrap()
      .then(response => {
        setText("Nuorodos atnaujintos sėkmingai");
        setLoadingLinks(false);
        setDisabled(false);
      })
      .catch(e => {
        setLoadingLinks(false);
        setDisabled(false);
        console.log(e);
      });
    };
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div>
            {text!==""?(<Alert variant={'success'}>{text}</Alert>):('')}
            {errorText!==""?(<Alert variant={'danger'}>{errorText}</Alert>):('')}
          </div>
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
              disabled={disabled}
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
              disabled={disabled}
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
                  <button type="button" disabled={disabled} className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={()=>updateLinks()}>
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
