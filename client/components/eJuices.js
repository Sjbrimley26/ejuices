import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import bottlePic from "../assets/images/bottle.png";
import "../assets/styles/eJuices.scss";
import "../assets/styles/Bottle.scss";
import Popup from "reactjs-popup";

const handleResponse = response => {
  return response.json().then(json => {
    if (response.ok) {
      return json;
    } else {
      return Promise.reject({
        ...json,
        statusText: response.statusText,
        status: response.status
      });
    }
  });
};

class EJuices extends Component {
  constructor(props) {
    super(props);
    this.selectFlavor = this.selectFlavor.bind(this);
    this.getFlavors = this.getFlavors.bind(this);
    this.changePG = this.changePG.bind(this);
    this.changeVG = this.changeVG.bind(this);
    this.state = {
      currentlySelected: "",
      bottleFlavors: [],
      flavors: [],
      pgHeight: 5,
      vgHeight: 3,
      pgTop: 190,
      vgTop: 187
    };
  }

  componentWillMount() {
    this.getFlavors();
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

  addFlavorToDB(name, percent) {
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
    .then(handleResponse)
    .then(flavor => {
      console.log(flavor.data.addFlavorToDB);
    })
    .catch(err => {
      return alert("Could not add flavor!", err);
    });
  }

  selectFlavor(flavor) {
    return this.setState({
      bottleFlavors: this.state.bottleFlavors.concat(flavor)
    });
  }

  getFlavors() {
    const query = `
      query {
        allFlavors {
          name
          avg_percent
        }
      }
    `;

    fetch("/graphql", {
      body: JSON.stringify({ query }),
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    })
    .then(response => {
      response.json().then(json => {
        this.setState({ flavors: json.data.allFlavors });
      });
    });
  
  }

  changePG (percentage) {
    /*
    pg -> height + top = 195;
when height increases, top decreases by same amount
top = 195 - height
for every %, increase height by 2

vg -> height + top = pg top
same rules
*/
    return this.setState({
      pgHeight: this.state.pgHeight + (2 * percentage),
      pgTop: this.state.pgTop - (2 * percentage),
      vgTop: this.state.vgTop - (2 * percentage)
    });

  }

  changeVG (percentage) {
    return this.setState({
      vgHeight: this.state.vgHeight + (2 * percentage),
      vgTop: this.state.vgTop - (2 * percentage)
    });
  }

  render() {
    return <div className="midBox">
        <div className="halfBox">
          <div className="bottleBlock">
            <div className="pgFill" style={{height: this.state.pgHeight, top: this.state.pgTop}} />
            <div className="vgFill" style={{height: this.state.vgHeight, top: this.state.vgTop}} />
            <img className="bottlePic" height="200px" width="200px" src={bottlePic} />
          </div>
        </div>
        <div className="halfBox halfBox--column">
          <label>Add a Flavor to the Bottle!</label>
          <Popup trigger={<button>Pick Flavor</button>} modal>
          <div>
            <p>Name, Recommended Percentage</p>
            {this.state.flavors.map((flavor, i) => {
              return (
                <div key={i}>
                <input type="radio" name='flavorOption'/>
                <label>{flavor.name} ({flavor.avg_percent}%)</label>
                </div>
              );
            })}
            <button onClick={this.selectFlavor}>Select!</button>
            </div>
          </Popup>
        </div>
      </div>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(EJuices));
