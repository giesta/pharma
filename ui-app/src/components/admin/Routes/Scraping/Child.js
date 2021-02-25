import React from "react";
import Scraping from "../../../symptoms/scrap.component";

class Child extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div className="kanban__nav-wrapper">
            <div className="kanban__nav-name">
              <div className="kanban-name">Studio Scraping</div>                
            </div>
            
          </div>
        </section>
        <section className="kanban__main">
          <div className="kanban__main-wrapper"><Scraping/></div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
