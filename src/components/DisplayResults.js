/* eslint-disable jsx-a11y/alt-text */
import { get as getQuery } from "axios";
import React, { lazy, Component, Suspense } from "react";
import { Button, Card } from "react-bootstrap";
import debateEV from "../Logo/debatevsquarefinal.svg";
const InfiniteScroll = lazy(() => import("react-infinite-scroll-component"));
const Filters = lazy(() => import("../utils/Filters"));
const CardPreview = lazy(() => import("../utils/CardPreview"));
const SearchBox = lazy(() => import("../utils/SearchBox"));
const ScrollToTop = lazy(() => import("../utils/scrollToTop"));

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
class DisplayResults extends Component {
  state = {
    ref: "",
    page: 1,
    cards: [],
    search: "",
    isLoading: -1,
    amt: "20",
    searchtext: "",
    total: 0,
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
    loading: true,
    name: null,
    bannerHtml: "<p></p>",
    array: [],
  };
  setFilters = (year, dtype) => {
    this.setState({ years: year });
    this.setState({ dtypes: dtype });
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
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    console.log(m);
    this.setState({ search: m });
    this.setState({ amt: "20" });
    let url =
      "https://api.debatev.com/api/v1/search?q=" +
      m +
      "&p=" +
      (this.state.page - 1);

    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] });
      array.pop();
      this.setState({ cards: array });
      this.setState({ isLoading: 0 });
    });
  };

  fetchMoreData = () => {
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    this.setState({ search: m });
    this.setState({ amt: "20" });
    let url =
      "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + this.state.page;

    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] });
      array.pop();
      this.setState({ cards: this.state.cards.concat(array) });
    });
    this.setState({ page: this.state.page + 1 });
  };

  async getData(url) {
    let data = await getQuery(url);
    console.log(data.data);
    return data.data;
  }

  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="searchcard">
          {" "}
          <ScrollToTop />
          <Card
            style={{
              flex: 1,
              alignItems: "right",
              justifyContent: "center",
              flexGrow: true,
              borderWidth: 0,
              flexDirection: "row",
              marginTop: "20px",
            }}
          >
            <a href="https://www.debatev.com/">
              <img
                src={debateEV}
                style={{
                  height: 80,
                  width: 80,
                  position: "absolute",
                  top: -20,
                  left: 30,
                }}
              />
            </a>

            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
                marginLeft: 140,
              }}
            >
              <SearchBox getUrl={this.getUrl} />
              <Card
                style={{
                  flex: 1,
                  alignItems: "right",
                  justifyContent: "right",
                  flexGrow: true,
                  borderWidth: 0,
                  flexDirection: "row",
                  marginTop: -7,
                  marginBottom: 5,
                }}
              >
                <Filters
                  stateChanger={this.setFilters}
                  selectedValues={this.state.selectedValues}
                />{" "}
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
            <div style={{ width: "40%" }} />
          </Card>
          <Card
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "right",
              flexGrow: true,
              borderWidth: 0,
              flexDirection: "row",
              marginLeft: "10%",
            }}
          >
            <div style={{ width: "9%", color: "#32a852" }} />
            {window.innerWidth >= 760 ? (
              <Button
                id="dropdown-basic-button"
                style={{
                  borderWidth: 0,
                  position: "absolute",
                  right: 15,
                  top: -50,
                }}
              >
                {"1" +
                  " - " +
                  (this.state.amt * this.state.page > this.state.total
                    ? this.state.total
                    : this.state.amt * this.state.page) +
                  " of " +
                  this.state.total}
              </Button>
            ) : null}
            <div style={{ width: "5%", color: "#32a852" }} />
          </Card>{" "}
          <Card
            style={{
              flex: 1,
              alignItems: "right",
              justifyContent: "center",
              flexGrow: true,
              borderWidth: 0,
              flexDirection: "row",
            }}
          >
            <Card style={{ flex: 1, borderWidth: 0 }} />
            <Card
              style={{
                flexDirection: "column",
                flex: 15,
                borderWidth: 0,
                marginTop: "auto",
              }}
            >
              <InfiniteScroll
                dataLength={this.state.cards.length}
                next={this.fetchMoreData}
                hasMore={
                  this.state.cards.length < this.state.total - 10 &&
                  this.state.total !== 0
                }
                loader={<h4>Loading...</h4>}
                endMessage={<h4>No more cards to display.</h4>}
              >
                {this.state.cards.map((card) => (
                  <CardPreview
                    key={card[0]}
                    cardData={card}
                    history={this.props.history}
                  />
                ))}
              </InfiniteScroll>

              {this.state.cards.length === 0 && this.state.isLoading !== -1 ? (
                <Card style={{ borderWidth: 0 }}>
                  No Results have been found
                </Card>
              ) : null}
            </Card>
            <Card style={{ flex: 1, borderWidth: 0 }} />
          </Card>
        </div>
      </Suspense>
    );
  }
}

export default DisplayResults;
