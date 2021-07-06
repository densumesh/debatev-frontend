/* eslint-disable jsx-a11y/alt-text */
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import React, { Component } from "react";
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import debateEV from "../Logo/debatevsquarefinal.svg";
import CardPreview from "./CardPreview";

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
    options: [
      { name: "2014", id: 1, group: "Year" },
      { name: "2015", id: 2, group: "Year" },
      { name: "2016", id: 3, group: "Year" },
      { name: "2017", id: 4, group: "Year" },
      { name: "2018", id: 5, group: "Year" },
      { name: "2019", id: 6, group: "Year" },
      { name: "2020", id: 7, group: "Year" },
      { name: "College Policy", id: 8, group: "Data Set" },
      { name: "High School LD", id: 9, group: "Data Set" },
      { name: "High School Policy", id: 10, group: "Data Set" },
      { name: "OpenEv", id: 11, group: "Data Set" },
      { name: "PF (Beta)", id: 12, group: "Data Set" },
    ],
    searchtext: "",
    total: 0,
    selectedList: null,
    a14: false,
    a15: false,
    a16: false,
    a17: false,
    a18: false,
    a19: false,
    a20: false,
    hspolicy: false,
    ld: false,
    college: false,
    openev: false,
    pf: false,
    loading: true,
    name: null,
    bannerHtml: "<p></p>",
    array: [],
  };

  getUrl = () => {
    let years = "";
    let url = "";
    if (this.state.a14 === true) {
      years = years + "2014,";
    }
    if (this.state.a15 === true) {
      years = years + "2015,";
    }
    if (this.state.a16 === true) {
      years = years + "2016,";
    }
    if (this.state.a17 === true) {
      years = years + "2017,";
    }
    if (this.state.a18 === true) {
      years = years + "2018,";
    }
    if (this.state.a19 === true) {
      years = years + "2019,";
    }
    if (this.state.a20 === true) {
      years = years + "2020,";
    }

    if (years.length > 0)
      url = url + "&year=" + years.substring(0, years.length - 1);

    let dtypes = "";
    if (this.state.ld === true) {
      dtypes = dtypes + "ld,";
    }

    if (this.state.hspolicy === true) {
      dtypes = dtypes + "hspolicy,";
    }

    if (this.state.college === true) {
      dtypes = dtypes + "college,";
    }
    if (this.state.openev === true) {
      dtypes = dtypes + "openev,";
    }
    if (this.state.pf === true) {
      dtypes = dtypes + "pf,";
    }

    if (dtypes.length > 0)
      url = url + "&dtype=" + dtypes.substring(0, dtypes.length - 1);

    return url;
  };

  onSelect = (selectedList, selectedItem) => {
    switch (selectedItem.name) {
      case "2014":
        this.setState({ a14: true });
        break;

      case "2015":
        this.setState({ a15: true });
        break;

      case "2016":
        this.setState({ a16: true });
        break;

      case "2017":
        this.setState({ a17: true });
        break;

      case "2018":
        this.setState({ a18: true });
        break;

      case "2019":
        this.setState({ a19: true });
        break;

      case "2020":
        this.setState({ a20: true });
        break;

      case "College Policy":
        this.setState({ college: true });
        break;

      case "High School LD":
        this.setState({ ld: true });
        break;

      case "High School Policy":
        this.setState({ hspolicy: true });
        break;

      case "OpenEv":
        this.setState({ openev: true });
        break;

      case "PF (Beta)":
        this.setState({ pf: true });
        break;

      default:
        break;
    }
  };

  onRemove = (_selectedList, selectedItem) => {
    switch (selectedItem.name) {
      case "2014":
        this.setState({ a14: false });
        break;

      case "2015":
        this.setState({ a15: false });
        break;

      case "2016":
        this.setState({ a16: false });
        break;

      case "2017":
        this.setState({ a17: false });
        break;

      case "2018":
        this.setState({ a18: false });
        break;

      case "2019":
        this.setState({ a19: false });
        break;

      case "2020":
        this.setState({ a20: false });
        break;

      case "College Policy":
        this.setState({ college: false });
        break;

      case "High School LD":
        this.setState({ ld: false });
        break;

      case "High School Policy":
        this.setState({ hspolicy: false });
        break;

      case "OpenEv":
        this.setState({ openev: false });
        break;

      case "PF (Beta)":
        this.setState({ pf: false });
        break;

      default:
        break;
    }
  };

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

    function years1(currElm) {
      console.log(currElm);
      return currElm.includes("year");
    }
    function dtypes1(currElm) {
      console.log(currElm);
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
          this.onSelect(this.state.selectedList, { name: year1 });
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
            this.onSelect(this.state.selectedList, { name: "College Policy" });
          } else if (dtype1 === "ld") {
            selectedValues.push({ name: "High School LD" });
            this.onSelect(this.state.selectedList, { name: "High School LD" });
          } else if (dtype1 === "hspolicy") {
            selectedValues.push({ name: "High School Policy" });
            this.onSelect(this.state.selectedList, {
              name: "High School Policy",
            });
          } else if (dtype1 === "openev") {
            selectedValues.push({ name: "OpenEv" });
            this.onSelect(this.state.selectedList, { name: "OpenEv" });
          } else if (dtype1 === "pf") {
            selectedValues.push({ name: "PF (Beta)" });
            this.onSelect(this.state.selectedList, { name: "PF (Beta)" });
          }
        }
      this.setState({ selectedValues: selectedValues.concat(years) });
    }
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
    let data = await axios.get(url);
    console.log(data.data);
    return data.data;
  }

  async getText(text) {
    this.setState({ searchtext: text });
    await axios
      .get(
        "https://api.debatev.com/api/v1/autocomplete?q=" + text + this.getUrl()
      )
      .then((data) => {
        let object = data.data;
        let array = Object.keys(object).map(function (k) {
          let str = object[k][1].toString();
          return str.replace(/(<([^>]+)>)/gi, "");
        });
        this.setState({ array: array });
      });
  }

  constructor() {
    super();
    this.search = React.createRef();
  }
  render() {
    return (
      <div className="searchcard">
        {" "}
        <Card
          style={{ height: 20, flex: 1, borderWidth: 0, alignItems: "center" }}
        >
          {" "}
        </Card>
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

          <div style={{ width: 150 }} />
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "50%",
            }}
          >
            <InputGroup
              className="mb-3"
              style={{ flex: 1, borderRadius: "30" }}
            >
              <Autocomplete
                id="search-bar"
                freeSolo
                options={this.state.array}
                style={{ width: "100%", flex: 1 }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <FormControl
                      ref={this.search}
                      placeholder="Search for a card                 "
                      y="basic-addon2"
                      style={{ borderRightWidth: 0 }}
                      onClose={(_event, _reason) => {
                        this.setState({ array: [] });
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter")
                          window.location.href =
                            "/search/" +
                            this.search.current.value +
                            this.getUrl();
                      }}
                      {...params.inputProps}
                    />
                  </div>
                )}
                onKeyPress={(e) => {
                  if (e.key === "Enter")
                    window.location.href =
                      "/search/" + this.state.searchtext + this.getUrl();
                  sessionStorage.setItem("filters", this.getUrl());
                }}
                onInputChange={(_event, newValue) => {
                  this.getText(newValue);
                }}
              />

              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={(_e) => {
                    window.location.href =
                      "/search/" + this.state.searchtext + this.getUrl();
                    sessionStorage.setItem("filters", this.getUrl());
                  }}
                >
                  <Icon.Search />
                </Button>
              </InputGroup.Append>
            </InputGroup>
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
              {window.innerWidth >= 760 ? (
                <Multiselect
                  className="advanced"
                  options={this.state.options}
                  selectedValues={this.state.selectedValues}
                  onSelect={this.onSelect}
                  onRemove={this.onRemove}
                  displayValue="name"
                  groupBy="group"
                  style={{
                    multiselectContainer: {
                      width: "60%",
                      height: "30%",
                      marginLeft: "auto",
                    },
                  }}
                  showCheckbox={true}
                  placeholder={this.getUrl() !== "" ? "" : "Advanced Filters "}
                  closeOnSelect={false}
                />
              ) : null}
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
            >
              {this.state.cards.map((card) => (
                <CardPreview cardData={card} history={this.props.history} />
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
