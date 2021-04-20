import React from "react";
import { NavLink } from "react-router-dom";

class Settings extends React.Component {
  render() {
    return (
      <NavLink to="/scraping" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <i className="material-icons">face</i>
          <span >
            Profilis
          </span>
        </div>
      </NavLink>
    );
  }
}

export default Settings;
