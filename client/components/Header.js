import React, { Component } from "React";
import "../assets/styles/Header.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginAction, logoutAction } from "../store/actions";
import { withRouter } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuIsOpen: false
    };
  }

  componentWillMount() {
    fetch("/loginCheck", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache"
      },
      credentials: "same-origin"
    })
      .then(response => {
        return response.json();
      })
      .then(user => {
        user != null ? this.props.loginAction(user) : this.props.logoutAction();
      })
      .catch(err => {
        console.log(err);
      });
  }

  async handleLogout() {
    try {
      const response = await fetch("/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cache: "no-cache"
        },
        credentials: "same-origin"
      });
      const json = await response.json();
      if (json.message) {
        this.props.logoutAction();
      } else {
        this.props.logoutAction();
        throw "No success message was received from the server";
      }
    } catch (err) {
      alert("Error logging out", err);
    }
  }

  navTo(url) {
    this.setState({ menuIsOpen: false });
    return this.props.history.push(`/${url}`);
  }

  toggleMenu() {
    const trigger = !this.state.menuIsOpen;
    return this.setState({ menuIsOpen: trigger });
  }

  render() {
    const userName = this.props.user.displayName || "Stranger";
    return (
      <div className="header">
        <h2>Howdy, {userName}!</h2>
        {this.props.isAuthenticated ? (
          <span>
            <button onClick={this.toggleMenu} className="hamburger">
              <img src="https://cdn0.iconfinder.com/data/icons/social-messaging-productivity-4/128/menu-2-512.png" />
            </button>
            <button onClick={this.handleLogout} className="loginButton">
              Logout
            </button>
          </span>
        ) : (
          <form method="GET" action="/auth/google">
            <button type="submit" className="loginButton">
              Login
            </button>
          </form>
        )}
        {this.state.menuIsOpen ? (
          <div className="navMenu">
            <button onClick={this.navTo.bind(this, "ejuices")}>E-Juices</button>
            <button>Two</button>
            <button>Three</button>
            <button>Four</button>
            <button>Five</button>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ loginAction, logoutAction }, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
