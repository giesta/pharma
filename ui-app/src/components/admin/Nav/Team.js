import React from "react";
import Invite from "./Invite.js";

class Team extends React.Component {
  render() {
    return (
      <div className="kanban__nav-avs">
        <div className="kanban__nav-avs-img">
          <img src={require("../../../assets/img/guvert.jpg").default} />
        </div>
        <div className="kanban__nav-avs-img">
          <img src={require("../../../assets/img/thompson.jpg").default} />
        </div>
        <div className="kanban__nav-avs-img">
          <img src={require("../../../assets/img/nilson.jpg").default} />
        </div>
        <div className="kanban__nav-avs-img">
          <img src={require("../../../assets/img/cobain.jpg").default} />
        </div>
        <Invite />
      </div>
    );
  }
}

export default Team;
