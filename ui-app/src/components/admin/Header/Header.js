import React from "react";
import Info from "./Info.js";
import Search from "./Search.js";
import Messages from "./Messages.js";
import Notification from "./Notification.js";

class Header extends React.Component {
  render() {
    return (
      <section className="kanban__header text-right">
        <div className="kanban__header-search"></div>
        <div className="kanban__header-info ">
        <div className="mail-icon"></div>
          <Info />
        </div>
      </section>
    );
  }
}

export default Header;
