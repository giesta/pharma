import React from "react";
import DrugsList from "../../../drugs/drugs-list.component";

class Child extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div className="kanban__nav-wrapper">
            
          </div>
        </section>
        <section className="kanban__main">
          <div>
          <DrugsList/>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
