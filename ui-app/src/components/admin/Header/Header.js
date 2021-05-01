import React from "react";
import Info from "./Info.js";

class Header extends React.Component {
  render() {
    return (
      <section className="kanban__header text-right">
        <div className="kanban__header-search"></div>
        <div className="kanban__header-info ">        
          <Info logOut = {this.props.logOut}/>
        </div>
      </section>
    );
  }
}

export default Header;
