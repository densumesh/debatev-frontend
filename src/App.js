import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const DisplayResults = lazy(() => import("./pages/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./pages/ImFeelingLucky"));
const SavedCards = lazy(() => import("./pages/savedCards"));

class App extends Component {
  state = {};

  render() {
    return (
      <Suspense fallback={<div> </div>}>
        <Router>
          <Routes>
            <Route path="/imfeelinglucky" element={<ImFeelingLucky />} />
            <Route path="/search/:id" element={<DisplayResults />} />
            <Route path="/search" element={<DisplayResults />} />
            <Route path="/saved" element={<SavedCards />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </Suspense>
    );
  }
}

export default App;
