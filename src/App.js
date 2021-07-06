import React, { Component } from "react";
import HomePage from "./components/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import DisplayResults from "./components/DisplayResults";
import ImFeelingLucky from "./components/ImFeelingLucky";
import SavedCards from "./components/savedCards";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  state = {};
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              path="/imfeelinglucky"
              render={(props) => <ImFeelingLucky {...props} />}
            ></Route>
            <Route
              path="/search/:id"
              render={(props) => (
                <DisplayResults yearFilters={props.yearFilters} {...props} />
              )}
            ></Route>
            <Route
              path="/search"
              render={(props) => (
                <DisplayResults yearFilters={props.yearFilters} {...props} />
              )}
            ></Route>
            <Route
              path="/saved"
              render={(props) => (
                <SavedCards yearFilters={props.yearFilters} {...props} />
              )}
            ></Route>
            <Route path="/" render={(props) => <HomePage {...props} />}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
