import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "../router/AppRouter";
import "../assets/styles/App.scss";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../store/reducer";

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById("app")
);
