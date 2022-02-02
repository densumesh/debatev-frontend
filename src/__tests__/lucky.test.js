import React from "react";
import ImFeelingLucky from "../components/ImFeelingLucky";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "jest-location-mock";

configure({ adapter: new Adapter() });
it("Opens Im feeling lucky without crashing", () => {
  window.location.assign("/imfeelinglucky");
  mount(
    <Router>
      <Routes>
        <Route path="/imfeelinglucky" element={<ImFeelingLucky />} />
      </Routes>
    </Router>
  );
});
