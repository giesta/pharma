import React from "react";
import Manage from "./Manage.js";
import Settings from "./Settings.js";
import Medication from "./Profile.js";

class Sidebar extends React.Component {
  render() {
    return (
      <section className="kanban__sidebar">
        <div className="kanban__sidebar-menu">
          <Medication />
          <Manage />
          <Settings />
          
        </div>
        
      </section>
    );
  }
}

export default Sidebar;
