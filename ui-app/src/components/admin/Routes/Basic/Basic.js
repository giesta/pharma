import React from "react";
import Loadable from "react-loadable";

class Basic extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Nav />
      </React.Fragment>
    );
  }
}

const Loading = () => <div className="loading">Loading...</div>;

const Nav = Loadable({
  loader: () => import("../../Nav/Nav.js"),
  loading: Loading
});

export default Basic;
