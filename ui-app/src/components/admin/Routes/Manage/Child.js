import React from "react";
import UsersList from "../../../users/users-list.component";

class Child extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="kanban__nav">
          <div className="kanban__nav-wrapper">
            <div className="kanban__nav-name">
              <div className="kanban-name">Users Manage</div>
            </div>
          </div>
        </section>
        <section className="kanban__main">
          <div>
          <UsersList/>
            </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
