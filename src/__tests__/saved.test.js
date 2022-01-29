import React from "react";
import SavedCards from "../components/savedCards";
import { shallow } from "enzyme";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });
it("can open saved cards without crashing", () => {
  shallow(<SavedCards />);
});
