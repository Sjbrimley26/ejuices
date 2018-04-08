import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/Header";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path="/" render={props => <Home {...props} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
