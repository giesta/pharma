import React, { useEffect } from 'react';
import { CSVReader } from 'react-papaparse';
import DrugsDataService from "../../services/drugs/list.service";

export default function CSVReader2() {
  const [drugs, setDrugs] = React.useState([]);

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
  const handleOnDrop = (data) => {
    console.log('---------------------------');
    console.log(data);
    setDrugs(data);
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
      <>
      <div className="container">
        <div className="row">
        <div className="col-6 col-sm-3">
          <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){saveDrugs()}}>
              Import
          </button>
          
    </div>
          <div class="col-6 col-sm-3">
            <h5>Upload Drugs CSV file: </h5>
          </div>
          <div class="col-6 col-sm-3">
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              addRemoveButton
              onRemoveFile={handleOnRemoveFile}
              config={{header: true,}}
              style={{
                dropArea: {
                  borderColor: 'pink',
                  borderRadius: 20,
                },
                dropAreaActive: {
                  borderColor: 'red',
                },
                dropFile: {
                  width: 100,
                  height: 120,
                  background: '#ccc',
                },
                fileSizeInfo: {
                  color: '#fff',
                  backgroundColor: '#000',
                  borderRadius: 3,
                  lineHeight: 1,
                  marginBottom: '0.5em',
                  padding: '0 0.4em',
                },
                fileNameInfo: {
                  color: '#fff',
                  backgroundColor: '#000',
                  borderRadius: 3,
                  fontSize: 14,
                  lineHeight: 1,
                  padding: '0 0.4em',
                },
                removeButton: {
                  color: 'red',
                },
                progressBar: {
                  backgroundColor: 'blue',
                },
              }}
            >
            <span>Drop CSV file here or click to upload.</span>
            </CSVReader>
          </div>
        </div>
      </div>
      </>
    );
  
}