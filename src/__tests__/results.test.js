import React from "react";
import DisplayResults from "../pages/DisplayResults.js";
import { render } from "@testing-library/react";
import "jest-location-mock";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

it("can search without crashing", () => {
  window.location.assign("/search/test");

  render(
    <Router>
      <Routes>
        <Route path="/search/:id" element={<DisplayResults />} />
      </Routes>
    </Router>
  );
});
