import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import bottlePic from "../assets/images/bottle.png";
import "../assets/styles/eJuices.scss";
import "../assets/styles/Bottle.scss";
import Popup from "reactjs-popup";

const findPG = element => {
  return element.flavor === "PG";
};

const findVG = element => {
  return element.flavor === "VG";
}

const findFlavorName = name => element => {
  return element.flavor === name;
}

const handleJSONResponse = response => {
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
    this.handleSelectedFlavorChange = this.handleSelectedFlavorChange.bind(this);
    this.handlePercentChange = this.handlePercentChange.bind(this);
    this.handlePGChange = this.handlePGChange.bind(this);
    this.handleVGChange = this.handleVGChange.bind(this);
    this.addFillers = this.addFillers.bind(this);
    this.state = {
      currentlySelected: "",
      currentPercentage: 0,
      currentPG: 0,
      currentVG: 0,
      bottleFlavors: [],
      flavors: [],
      flavorPopUpOpen: false,
      addFillerPopup: false,
      pgHeight: 0,
      vgHeight: 0,
      flavorHeight: 0,
      flavorTop: 200,
      pgTop: 200,
      vgTop: 200
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
      .then(handleJSONResponse)
      .then(flavor => {
        console.log(flavor.data.addFlavorToDB);
      })
      .catch(err => {
        return alert("Could not add flavor!", err);
      });
  }

  selectFlavor(flavor) {
    let { bottleFlavors } = this.state;
    this.changeFlavorAmount(this.state.currentPercentage);
    let foundIndex = bottleFlavors.findIndex(findFlavorName(this.state.currentlySelected));
    if (foundIndex > -1) {
      const oldPercentage = bottleFlavors[foundIndex].percentage;
      bottleFlavors.splice(bottleFlavors.findIndex(findFlavorName(this.state.currentlySelected)),
      1,
      {
        flavor: this.state.currentlySelected,
        percentage: this.state.currentPercentage + oldPercentage
      }
       );
    } else if (this.state.currentPercentage > 0) {
      bottleFlavors = bottleFlavors.concat({
        flavor: this.state.currentlySelected,
        percentage: this.state.currentPercentage
      });
    }
    return this.setState({
      bottleFlavors: bottleFlavors,
      currentlySelected: "",
      flavorPopUpOpen: false,
      currentPercentage: 0,
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
    }).then(response => {
      response.json().then(json => {
        this.setState({ flavors: json.data.allFlavors });
      });
    });
  }

  changePG(percentage) {
    this.setState({
      pgHeight: this.state.pgHeight + 2 * percentage,
      pgTop: 200 - 
        this.state.flavorHeight - 
        this.state.vgHeight - 
        (this.state.pgHeight + 2 * percentage),
    });

    // I think that calling setState so close together is causing it not to render
    // but doing a setTimeout makes it work, it causes a funky bug to appear briefly though
    setTimeout(() => {
      if (this.state.pgTop === this.state.vgTop) {
        this.setState({
          pgTop: this.state.pgTop - this.state.pgHeight
        });
      }
    }, 100);
  }

  changeFlavorAmount(percentage) {
    this.setState({
      flavorHeight: this.state.flavorHeight + 2 * percentage,
      vgTop: this.state.vgTop - 2 * percentage,
      flavorTop: 200 - (this.state.flavorHeight + 2 * percentage)
    });

    setTimeout(() => {
      this.setState({
        pgTop: 200 -
          this.state.flavorHeight -
          (this.state.vgHeight) -
          (this.state.pgHeight)
      });
    }, 100);

  }

  changeVG(percentage) {
    this.setState({
      vgHeight: this.state.vgHeight + 2 * percentage,
      vgTop: 200 - this.state.flavorHeight - (this.state.vgHeight + 2 * percentage)
    });

    setTimeout(() => {
      this.setState({
        pgTop: 200 -
          this.state.flavorHeight -
          (this.state.vgHeight) -
          (this.state.pgHeight)
      });
    }, 100);
  }

  handleSelectedFlavorChange(e) {
    this.setState({
      currentlySelected: e.target.value
    });
  }

  handlePercentChange(e) {
    const numReg = /\d{1,2}/;
    if (numReg.test(e.target.value)) {
      const num = parseInt(e.target.value);
      const { flavorHeight, pgHeight, vgHeight } = this.state;
      if ((num * 2) + flavorHeight + pgHeight + vgHeight <= 200) {
        this.setState({ currentPercentage:  num });
      }
      else {
        alert("Bottle is too full to add that much!");
      }
    }
  }

  handleVGChange(e) {
    const numReg = /\d{1,2}/;
    if (numReg.test(e.target.value)) {
      const num = parseInt(e.target.value);
      const { flavorHeight, pgHeight, vgHeight } = this.state;
      if ((num * 2) + flavorHeight + pgHeight + vgHeight <= 200) {
        this.setState({ currentVG:  num });
      }
      else {
        alert("Bottle is too full to add that much!");
      }
    }
  }

  handlePGChange(e) {
    const numReg = /\d{1,2}/;
    if (numReg.test(e.target.value)) {
      const num = parseInt(e.target.value);
      const { flavorHeight, pgHeight, vgHeight } = this.state;
      if ((num * 2) + flavorHeight + pgHeight + vgHeight <= 200) {
        this.setState({ currentPG:  num });
      }
      else {
        alert("Bottle is too full to add that much!");
      }
    }
  }

  addFillers(e) {
    e.stopPropagation();
    let { bottleFlavors, currentVG } = this.state;

    if (currentVG >= 0) {
      this.changeVG(currentVG);
      if (bottleFlavors.findIndex(findVG) > -1) {
        const oldPercentage = bottleFlavors[bottleFlavors.findIndex(findVG)].percentage;
        bottleFlavors.splice(bottleFlavors.findIndex(findVG), 1, {
          flavor: "VG",
          percentage: oldPercentage + currentVG
        });
      } else {
        bottleFlavors = bottleFlavors.concat({
          flavor: "VG",
          percentage: currentVG
        });
      }
    }

    let { currentPG } = this.state;

    if (currentPG >= 0) {
      setTimeout(this.changePG(currentPG), 100);
      if (bottleFlavors.findIndex(findPG) > -1) {
        const oldPercentage = bottleFlavors[bottleFlavors.findIndex(findPG)].percentage;
        bottleFlavors.splice(bottleFlavors.findIndex(findPG), 1, {
          flavor: "PG",
          percentage: oldPercentage + currentPG
        });
      } else {
        bottleFlavors = bottleFlavors.concat({
          flavor: "PG",
          percentage: currentPG
        });
      }
    }

    this.setState({
      bottleFlavors: bottleFlavors,
      currentPG: 0,
      currentVG: 0,
      addFillerPopup: false
    })
  }

  render() {
    const { flavorHeight, vgHeight, pgHeight } = this.state;
    const remainingPercentage = (200 - flavorHeight - pgHeight - vgHeight) / 2;
    return <div className="midBox" onClick={() => {
      this.setState({
        flavorPopUpOpen: false,
        addFillerPopup: false
      })
    }}>
        <div className="halfBox">
          <div className="bottleBlock">
            <div className="pgFill" style={{ 
              height: this.state.pgHeight, 
              top: this.state.pgTop 
            }} />
            <div className="flavorFill" 
              style={{ 
                height: this.state.flavorHeight, 
                top: this.state.flavorTop 
              }} 
            />
            <div className="vgFill" 
              style={{ 
                height: this.state.vgHeight, 
                top: this.state.vgTop 
              }} 
            />
            <img className="bottlePic" height="200px" width="200px" src={bottlePic} />
          </div>
          <br />
          <div className="recipe">
            {this.state.bottleFlavors ? this.state.bottleFlavors.map(
                  (item, i) => {
                    const flavorLength = item.flavor.length;
                    const percentLength = item.percentage.toString().length;
                    const itemString =
                      item.flavor +
                      " " +
                      "-".repeat(22 - flavorLength / 0.8 - percentLength) +
                      " " +
                      item.percentage +
                      " %";
                    return <ul key={i}>{itemString}</ul>;
                  }
                ) : null}
          </div>
        </div>
        <div className="halfBox halfBox--column">
          <br />
          <label>Make a Recipe!</label>
          <br />
          <button onClick={(e) => {
              e.stopPropagation();
              this.setState({ flavorPopUpOpen: true });
            }}>
            {" "}
            Add Flavors{" "}
          </button>
          <Popup open={this.state.flavorPopUpOpen} modal>
            <div>
              <p>Name, Recommended Percentage</p>
              {this.state.flavors ? this.state.flavors.map((flavor, i) => {
                    return <div key={i}>
                        <input type="radio" name="flavorOption" value={flavor.name} onChange={this.handleSelectedFlavorChange} />
                        <label>
                          {flavor.name} ({flavor.avg_percent}%)
                        </label>
                      </div>;
                  }) : null}

              {this.state.currentlySelected ? <span>
                  <label>Enter a percentage </label>
                  <input type="text" onChange={this.handlePercentChange} value={this.state.currentPercentage} />
                </span> : null}
              <br />
              <button onClick={this.selectFlavor}>Select!</button>
              <br />
              <span>{remainingPercentage}% of bottle left</span>
            </div>
          </Popup>

          <br />
          <button onClick={(e) => {
              e.stopPropagation();
              this.setState({ addFillerPopup: true });
            }}>
            Add PG / VG
          </button>
          <Popup open={this.state.addFillerPopup} modal>
            <div>
              <label>VG</label>
              &nbsp;
              <input type="text" onChange={this.handleVGChange} value={this.state.currentVG} />
              <br />
              <label>PG</label>
              &nbsp;
              <input type="text" onChange={this.handlePGChange} value={this.state.currentPG} />
              <br />
              <button onClick={this.addFillers}>Add to Bottle!</button>
              <br />
              <span>{remainingPercentage}% of bottle left</span>
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
