import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/Header";
import EJuices from "../components/eJuices";
import Flavors from "../components/Flavors";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact={true} render={props => <Home {...props} />} />
          <Route path="/ejuices" render={props => <EJuices {...props} />} />
          <Route path="/flavors" render={props => <Flavors {...props} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
