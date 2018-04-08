import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

class EJuices extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.user.googleId) {
      setTimeout(() => {
        if (!this.props.user.googleId) {
          this.props.history.push("/");
        }
      }, 500);
    }
  }

  addFlavor(name, percent) {
    const query = `mutation {
      addFlavor(name: "${name}", avg_percent: ${percent}) {
        name
        avg_percent
        _id
      }
    }`;

    fetch("/graphql", {
      body: JSON.stringify({ query }),
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(flavor => {
        console.log(flavor.data.addFlavor);
      });
  }

  render() {
    return (
      <div>
        <p>Yippee!</p>
        <button onClick={this.addFlavor.bind(this, ["Red"], [3])}>
          Test Run!
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(EJuices));
