import React from "react";
import DisplayResults from "../components/DisplayResults.js";
import { mount } from "enzyme";
import "jest-location-mock";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

configure({ adapter: new Adapter() });
it("can search without crashing", () => {
  window.location.assign("/search/test");
  mount(
    <Router>
      <Routes>
        <Route path="/search/:id" element={<DisplayResults />} />
      </Routes>
    </Router>
  );
});
