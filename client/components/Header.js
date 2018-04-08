import React, { Component } from "React";
import styled from "styled-components";
import "../assets/styles/Header.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginAction, logoutAction } from "../store/actions";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
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
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const userName = this.props.user.displayName || "Stranger";
    return (
      <div className="header">
        <h1>Howdy {userName}!</h1>
        {this.props.isAuthenticated ? (
          <span>
            <button className="hamburger">
              <img
                src="https://cdn0.iconfinder.com/data/icons/social-messaging-productivity-4/128/menu-2-512.png"
                height="25px"
                width="28px"
                style={{ marginTop: "5px" }}
              />
            </button>
            <button
              onClick={this.handleLogout}
              className="loginButton"
              style={{
                position: "relative",
                top: "-5px"
              }}
            >
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
