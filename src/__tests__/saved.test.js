import React from "react";
import SavedCards from "../pages/savedCards";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });
it("can open saved cards without crashing", () => {
  mount(<SavedCards />);
});
