import React from "react";
import DisplayResults from "../components/DisplayResults.js";
import { shallow } from "enzyme";
import "jest-location-mock";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });
it("can search without crashing", () => {
  window.location.assign("/search/test");
  shallow(<DisplayResults />);
});
