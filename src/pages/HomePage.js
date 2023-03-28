/* eslint-disable jsx-a11y/alt-text */
import React, { Component, lazy } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import debatevlargefinal from "../Logo/debatevlargefinal.svg";
import { getUrl } from "../components/Filters";

const LoginButton = lazy(() => import("../components/LoginButton"));
const DarkToggle = lazy(() => import("../components/DarkModeToggle"));
const Filters = lazy(() => import("../components/Filters"));
const SearchBox = lazy(() => import("../components/SearchBox"));

class HomePage extends Component {
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
          <Button
            onClick={() => (window.location.href = "/saved")}
            style={
              window.innerWidth >= 760
                ? {
                    backgroundColor: "#1C86EE",
                    marginTop: "5px",
                    color: "#FFF",
                    borderWidth: 0,
                    position: "absolute",
                    top: 5,
                    right: 130,
                    marginRight: 10,
                  }
                : {
                    backgroundColor: "#1C86EE",
                    marginTop: "5px",
                    color: "#FFF",
                    borderWidth: 0,
                    position: "absolute",
                    top: 5,
                    marginRight: 10,
                  }
            }
          >
            Saved Cards
          </Button>
          {window.innerWidth >= 760 ? <DarkToggle /> : null}

          <LoginButton
            style={{
              backgroundColor: "#1C86EE",
              marginTop: "5px",
              color: "#FFF",
              borderWidth: 0,
              position: "absolute",
              top: 5,
              left: "1%",
              marginRight: 10,
            }}
          ></LoginButton>
        </Card>

        <Card style={{ alignItems: "center" }}>
          <img
            rel="preload"
            loading="lazy"
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
            <SearchBox getUrl={getUrl} />
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
              <Filters />
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
          {window.innerWidth >= 760
            ? "| Dens Sumesh, Akaash Kolluri, Rohan Agrawal | "
            : " | "}
          <a href="https://forms.gle/Vh6mBK2EKBmSQg3f8">Report a bug</a> |{" "}
          <a href="https://www.buymeacoffee.com/debateV">Support DebatEV</a>
        </div>
      </div>
    );
  }
}

export default HomePage;
