/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { Button, Card, InputGroup } from "react-bootstrap";
import debateEV2 from "../Logo/debatevlargefinal.svg";
import Banner from "../utils/banner";
import DarkToggle from "../utils/DarkModeToggle";
import Filters from "../utils/Filters";
import SearchBox from "../utils/SearchBox";
class HomePage extends Component {
  state = {
    searchtext: "",
    selectedList: null,
    selectedValues: [],
    years: {
      a14: false,
      a15: false,
      a16: false,
      a17: false,
      a18: false,
      a19: false,
      a20: false,
    },
    dtypes: {
      hspolicy: false,
      ld: false,
      college: false,
      openev: false,
      pf: false,
    },

    name: null,
    array: [],
  };

  getUrl = () => {
    let years = "";
    let url = "";
    if (this.state.years.a14 === true) {
      years = years + "2014,";
    }
    if (this.state.years.a15 === true) {
      years = years + "2015,";
    }
    if (this.state.years.a16 === true) {
      years = years + "2016,";
    }
    if (this.state.years.a17 === true) {
      years = years + "2017,";
    }
    if (this.state.years.a18 === true) {
      years = years + "2018,";
    }
    if (this.state.years.a19 === true) {
      years = years + "2019,";
    }
    if (this.state.years.a20 === true) {
      years = years + "2020,";
    }

    if (years.length > 0)
      url = url + "&year=" + years.substring(0, years.length - 1);

    let dtypes = "";
    if (this.state.dtypes.ld === true) {
      dtypes = dtypes + "ld,";
    }

    if (this.state.dtypes.hspolicy === true) {
      dtypes = dtypes + "hspolicy,";
    }

    if (this.state.dtypes.college === true) {
      dtypes = dtypes + "college,";
    }
    if (this.state.dtypes.openev === true) {
      dtypes = dtypes + "openev,";
    }
    if (this.state.dtypes.pf === true) {
      dtypes = dtypes + "pf,";
    }

    if (dtypes.length > 0)
      url = url + "&dtype=" + dtypes.substring(0, dtypes.length - 1);

    return url;
  };
  constructor() {
    super();
    this.search = React.createRef();
    function years1(currElm) {
      return currElm.includes("year");
    }
    function dtypes1(currElm) {
      return currElm.includes("dtype");
    }
    if (sessionStorage.getItem("filters") === null) {
    } else {
      var selectedValues = [];
      let years = [];
      if (
        sessionStorage
          .getItem("filters")
          .substring(1)
          .split("&")
          .find(years1)
          ?.substring(5)
          .split(",")
      )
        for (let year1 of sessionStorage
          .getItem("filters")
          .substring(1)
          .split("&")
          .find(years1)
          ?.substring(5)
          .split(",")) {
          years.push({ name: year1 });
        }

      if (
        sessionStorage
          .getItem("filters")
          .substring(1)
          .split("&")
          .find(dtypes1)
          ?.substring(6)
          .split(",")
      )
        for (let dtype1 of sessionStorage
          .getItem("filters")
          .substring(1)
          .split("&")
          .find(dtypes1)
          ?.substring(6)
          .split(",")) {
          if (dtype1 === "college") {
            selectedValues.push({ name: "College Policy" });
          } else if (dtype1 === "ld") {
            selectedValues.push({ name: "High School LD" });
          } else if (dtype1 === "hspolicy") {
            selectedValues.push({ name: "High School Policy" });
          } else if (dtype1 === "openev") {
            selectedValues.push({ name: "OpenEv" });
          } else if (dtype1 === "pf") {
            selectedValues.push({ name: "PF (Beta)" });
          }
        }
      this.state.selectedValues = selectedValues.concat(years);
    }
  }

  componentDidMount = () => {
    if (JSON.parse(localStorage.getItem("isDark")) === undefined) {
      localStorage.setItem("isDark", "false");
    }
    if (JSON.parse(localStorage.getItem("isDark"))) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  setFilters = (year, dtype) => {
    this.setState({ years: year });
    this.setState({ dtypes: dtype });
  };

  render() {
    return (
      <div>
        <Card
          style={{
            height: 300,
            borderWidth: 0,
            alignItems: "center",
          }}
        >
          <Banner />
          <Card
            style={{
              height: 0,
              borderWidth: 0,
              alignItems: "center",
            }}
          />{" "}
          <InputGroup>
            <Button
              style={{
                backgroundColor: "#1C86EE",
                color: "#FFF",
                borderWidth: 0,
                position: "absolute",
                top: 5,
                right: 130,
                marginRight: 10,
              }}
              onClick={(_e) => {
                window.location.href = "/saved";
              }}
            >
              Saved Cards
            </Button>
            <InputGroup.Append>
              <DarkToggle />
            </InputGroup.Append>
          </InputGroup>
          {window.innerWidth >= 760 ? (
            <img
              src={debateEV2}
              style={{
                height: 300,
                width: 500,
              }}
            />
          ) : (
            <img
              src={debateEV2}
              style={{
                height: 200,
                width: 300,
              }}
            />
          )}
          <Card
            style={{
              height: 25,

              borderWidth: 0,
              alignItems: "center",
            }}
          />
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexGrow: true,
            borderWidth: 0,
          }}
        >
          <div style={{ width: "25%" }} />
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "50%",
            }}
          >
            <SearchBox getUrl={this.getUrl} />
            <div style={{ width: "9%", color: "#32a852" }} />
            <Card
              style={{
                flex: 1,
                alignItems: "right",
                justifyContent: "right",
                flexGrow: true,
                borderWidth: 0,
                flexDirection: "row",
                marginTop: -2,
              }}
            >
              <Filters
                stateChanger={this.setFilters}
                selectedValues={this.state.selectedValues}
              />
              <div style={{ width: "9%", color: "#32a852" }} />
              <Button
                variant="outline-primary"
                className="luckybutton"
                style={{
                  borderWidth: 1,
                  color: "#001040",
                  marginRight: "auto",
                  marginLeft: "10%",
                  whiteSpace: "nowrap",
                }}
                onClick={(_e) => {
                  window.location.href = "/imfeelinglucky";
                }}
              >
                {" "}
                I'm Feeling Lucky{" "}
              </Button>
            </Card>{" "}
          </div>
          <div style={{ width: "25%" }} />
        </Card>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            textAlign: "center",
            width: "100%",
          }}
        >
          <a href="https://github.com/densumesh/debatev-frontend">
            Debate Evidence
          </a>{" "}
          | Dens Sumesh, Akaash Kolluri, Rohan Agrawal
        </div>
      </div>
    );
  }
}

export default HomePage;
