import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./components/HomePage"));
const DisplayResults = lazy(() => import("./components/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./components/ImFeelingLucky"));
const SavedCards = lazy(() => import("./components/savedCards"));

class App extends Component {
  state = {};

  render() {
    return (
      <Suspense fallback={<div> </div>}>
        <Router>
          <div>
            <Routes>
              <Route path="/imfeelinglucky" element={<ImFeelingLucky />} />
              <Route path="/search/:id" element={<DisplayResults />} />
              <Route path="/search" element={<DisplayResults />} />
              <Route path="/saved" element={<SavedCards />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </Suspense>
    );
  }
}

export default App;
