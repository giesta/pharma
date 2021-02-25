import React, { useEffect } from 'react';
import { CSVReader } from 'react-papaparse';


export default function CSVReader2(props) {
  
    return (
      <>
      <div className="container">
        <div className="row">
        <div className="col-6 col-sm-3">
          <button type="button" className="btn btn-outline-success btn-sm ts-buttom" size="sm" onClick={
            function(event){props.save()}}>
              {props.buttonTitle}
          </button>
          
    </div>
          <div class="col-6 col-sm-3">
            <h5>{props.title} </h5>
          </div>
          <div class="col-6 col-sm-3">
            <CSVReader
              onDrop={props.handleOnDrop}
              onError={props.handleOnError}
              addRemoveButton
              onRemoveFile={props.handleOnRemoveFile}
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