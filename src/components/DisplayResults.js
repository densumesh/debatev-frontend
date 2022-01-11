/* eslint-disable jsx-a11y/alt-text */
import React, { Component, lazy, Suspense } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InfiniteScroll from "react-infinite-scroll-component";
import debateEV from "../Logo/debatevsquarefinal.svg";
import Filters from "../utils/Filters";
import CardPreview from "../utils/CardPreview";
import SearchBox from "../utils/SearchBox";
import { CacheableResponse } from "workbox-cacheable-response";
import { Link } from "react-router-dom";

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
      a21: false,
    },
    dtypes: {
      hspolicy: false,
      ld: false,
      college: false,
      openev: false,
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
    if (this.state.years.a21 === true) {
      years = years + "2021,";
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
    function years1(currElm) {
      return currElm.includes("year");
    }
    function dtypes1(currElm) {
      return currElm.includes("dtype");
    }
    let params =
      "&" +
      window.location.href
        .substring(window.location.href.lastIndexOf("/") + 1)
        ?.split("&")[1] +
      "&" +
      window.location.href
        .substring(window.location.href.lastIndexOf("/") + 1)
        ?.split("&")[2];
    console.log(params);
    if (params) {
      let selectedValues = [];
      if (params.substring(1).split("&").find(years1)?.substring(5).split(","))
        for (let year1 of params
          .substring(1)
          .split("&")
          .find(years1)
          ?.substring(5)
          .split(",")) {
          selectedValues.push({ name: year1 });
        }

      if (params.substring(1).split("&").find(dtypes1)?.substring(6).split(","))
        for (let dtype1 of params
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
          }
        }
      this.state.selectedValues = selectedValues;
    }
  }

  componentDidMount = () => {
    let m = decodeURIComponent(
      window.location.href.substring(window.location.href.lastIndexOf("/") + 1)
    );
    console.log(m);
    this.setState({ search: m });
    this.setState({ amt: "20" });
    let url = "";
    if (m.match("[a-z0-9]{56,}")) {
      url = "https://api.debatev.com/api/v1/cards/" + m;
      console.log(url);
    } else {
      url =
        "https://api.debatev.com/api/v1/search?q=" +
        m +
        "&p=" +
        (this.state.page - 1);
    }

    this.getData(url).then((data) => {
      let object = data;
      console.log(data);
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] });
      array.pop();
      console.log(array);
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
      console.log(this.state.cards.concat(array));
      this.setState({ cards: this.state.cards.concat(array) });
    });
    this.setState({ page: this.state.page + 1 });
  };

  async getData(url) {
    const cacheable = new CacheableResponse({
      statuses: [404, 200],
    });
    if ((await caches.match(url, { cacheName: "api-cache" })) === undefined) {
      return fetch(url)
        .then((response) => {
          if (cacheable.isResponseCacheable(response)) {
            caches.open("api-cache").then(function (cache) {
              cache.keys().then(function (keys) {
                if (keys.length < 20) {
                  cache.put(url, response);
                } else {
                  cache.delete(keys[0]).then(function () {
                    cache.put(url, response);
                  });
                }
              });
            });
          }
          return response.clone().json();
        })
        .then((data) => {
          return data;
        });
    } else {
      return (await caches.match(url, { cacheName: "api-cache" })).json();
    }
  }

  buildUrl = () => {
    let year = "";
    let dtype = "";
    if (this.state.year?.length > 0) {
      year = "&year=" + this.state.year;
    }
    if (this.state.dtype?.length > 0) {
      dtype = "&dtype=" + this.state.dtype + ",";
    } else {
      dtype = "&dtype=";
    }
    return (
      "https://www.debatev.com/search/" +
      this.state.search +
      year +
      dtype +
      "usersubmit"
    );
  };

  render() {
    return (
      <div className="searchcard">
        {" "}
        <Suspense fallback={<div>Loading...</div>}>
          <ScrollToTop />
        </Suspense>
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
              alt={"Website logo"}
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
        <div style={{ height: 20 }} />
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
              endMessage={
                <h4>
                  No more cards to display. Do you want to include{" "}
                  <a href={this.buildUrl()}>user-submited cards?</a>
                </h4>
              }
            >
              {this.state.cards.map((card) => (
                <CardPreview key={card[0]} cardData={card} />
              ))}
            </InfiniteScroll>

            {this.state.cards.length === 0 && this.state.isLoading !== -1 ? (
              <Card style={{ borderWidth: 0 }}>No Results have been found</Card>
            ) : null}
          </Card>
          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>
      </div>
    );
  }
}

export default DisplayResults;
