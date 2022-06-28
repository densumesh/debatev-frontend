import React from "react";
import ImFeelingLucky from "../components/ImFeelingLucky";
import { render } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "jest-location-mock";

it("Opens Im feeling lucky without crashing", () => {
  window.location.assign("/imfeelinglucky");
  render(
    <Router>
      <Routes>
        <Route path="/imfeelinglucky" element={<ImFeelingLucky />} />
      </Routes>
    </Router>
  );
});
