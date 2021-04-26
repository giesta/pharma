import React from "react";
import Title from "./Title.js";

class Nav extends React.Component {
  render() {
    return (
      <section className="kanban__nav">
        <div className="kanban__nav-wrapper">
          <Title />
        </div>
      </section>
    );
  }
}

export default Nav;
