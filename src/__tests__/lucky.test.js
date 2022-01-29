import React from "react";
import ImFeelingLucky from "../components/ImFeelingLucky";
import { shallow } from "enzyme";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });
it("Opens Im feeling lucky without crashing", () => {
  shallow(<ImFeelingLucky />);
});
