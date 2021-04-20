import React from "react";
import Manage from "./Manage.js";
import Boards from "./Boards.js";
import Reports from "./Reports.js";
import Schedule from "./Schedule.js";
import Settings from "./Settings.js";
import Medication from "./Scraping.js";

class Sidebar extends React.Component {
  render() {
    return (
      <section className="kanban__sidebar">
        <div className="kanban__sidebar-menu">
          <Medication />
          <Manage />
          <Reports />
          <Settings />
          
        </div>
        
      </section>
    );
  }
}

export default Sidebar;
