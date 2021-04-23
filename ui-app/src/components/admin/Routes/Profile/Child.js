import React from "react";
import Profile from "../../../profile.component";

class Child extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div className="kanban__nav-wrapper">
            <div className="kanban__nav-name">
              <div className="kanban-name"></div>                
            </div>
            
          </div>
        </section>
        <section className="kanban__main">
          <div className="kanban__main-wrapper"><Profile/></div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
