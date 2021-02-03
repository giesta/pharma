import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';

export default class CSVReader2 extends Component {
  handleOnDrop = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  render() {
    return (
      <>
      <div className="container">
        <div className="row">
          <div class="col-6 col-sm-3">
            <h5>Upload Drugs CSV file: </h5>
          </div>
          <div class="col-6 col-sm-3">
            <CSVReader
              onDrop={this.handleOnDrop}
              onError={this.handleOnError}
              addRemoveButton
              onRemoveFile={this.handleOnRemoveFile}
            >
            <span>Drop CSV file here or click to upload.</span>
            </CSVReader>
          </div>
        </div>
      </div>
      </>
    );
  }
}