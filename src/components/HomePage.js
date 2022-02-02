/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DarkToggle from "../utils/DarkModeToggle";
import Filters from "../utils/Filters";
import SearchBox from "../utils/SearchBox";
import debatevlargefinal from "../Logo/debatevlargefinal.svg";

class HomePage extends Component {
  state = {
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
      a21: false,
      a22: false,
    },
    dtypes: {
      hspolicy: false,
      ld: false,
      college: false,
      openev: false,
      pf: false,
    },
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
    if (this.state.years.a21 === true) {
      years = years + "2021,";
    }
    if (this.state.years.a22 === true) {
      years = years + "2022,";
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

    if (dtypes.length > 0)
      url = url + "&dtype=" + dtypes.substring(0, dtypes.length - 1);

    return url;
  };

  constructor(props) {
    super(props);
    this.search = React.createRef();

    if (sessionStorage.getItem("filters") === null) {
    } else {
      sessionStorage.setItem("filters", "");
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
            height: 60,
            borderWidth: 0,
            alignItems: "center",
          }}
          className="home-page-header"
        >
          <Link to="/saved">
            <Button
              style={{
                backgroundColor: "#1C86EE",
                marginTop: "5px",
                color: "#FFF",
                borderWidth: 0,
                position: "absolute",
                top: 5,
                right: 130,
                marginRight: 10,
              }}
            >
              Saved Cards
            </Button>
          </Link>
          <DarkToggle />
        </Card>

        <Card style={{ alignItems: "center" }}>
          <img
            rel="preload"
            src={debatevlargefinal}
            style={
              window.innerWidth >= 760
                ? {
                    height: 300,
                    width: 500,
                  }
                : {
                    height: 200,
                    width: 300,
                  }
            }
            alt={"Website logo"}
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
                display: "flex",
                alignItems: "right",
                justifyContent: "right",
                flexShrink: true,
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
              <Link to="/imfeelinglucky">
                <Button
                  variant="outline-primary"
                  className="luckybutton"
                  style={{
                    borderWidth: 1,
                    color: "#001040",
                    marginRight: "auto",
                    marginLeft: "20",
                  }}
                >
                  {" "}
                  I'm Feeling Lucky{" "}
                </Button>
              </Link>
            </Card>{" "}
          </div>
          <div style={{ width: "25%" }} />
        </Card>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            textAlign: "center",
            width: "100%",
            height: 60,
            verticalAlign: "middle",
            lineHeight: 3.5,
          }}
          className="home-page-footer"
        >
          <a href="https://github.com/densumesh/debatev-frontend">
            Debate Evidence
          </a>{" "}
          | Dens Sumesh, Akaash Kolluri, Rohan Agrawal |{" "}
          <a href="https://forms.gle/Vh6mBK2EKBmSQg3f8">Report a bug</a>
        </div>
      </div>
    );
  }
}

export default HomePage;
