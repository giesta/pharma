import React from "react";
import UploadCSV from "../../../drugs/uploadCSV.component";

class Child extends React.Component {
  render() {
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
          <div className="kanban__main-wrapper"><UploadCSV/></div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
