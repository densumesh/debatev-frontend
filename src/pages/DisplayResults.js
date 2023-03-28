/* eslint-disable jsx-a11y/alt-text */
import React, { Component, lazy, Suspense } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import debatevsquarefinal from "../Logo/debatevsquarefinal.svg";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { getUrl } from "../components/Filters";

const ScrollToTop = lazy(() => import("../components/scrollToTop"));
const Filters = lazy(() => import("../components/Filters"));
const CardPreview = lazy(() => import("../components/CardPreview"));
const SearchBox = lazy(() => import("../components/SearchBox"));

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
class DisplayResults extends Component {
  state = {
    page: 1,
    cards: [],
    isLoading: true,
    amt: "20",
    total: 0,
    error: "",
  };

  constructor(props) {
    super(props);
    this.search = React.createRef();
  }

  componentDidMount = () => {
    let m = decodeURIComponent(
      window.location.href.substring(window.location.href.lastIndexOf("/") + 1)
    );
    let url = "";
    if (m.match("[a-z0-9]{56,}")) {
      url = "https://api.debatev.com/api/v1/cards/" + m;
    } else {
      url =
        "https://api.debatev.com/api/v1/search?q=" +
        m +
        "&p=" +
        (this.state.page - 1);
    }

    this.getData(url).then((data) => {
      this.setState({ total: data.total });
      this.setState({
        cards: data.cards,
      });
      this.setState({ isLoading: false });
    });
  };

  fetchMoreData = () => {
    this.setState({ isLoading: true });
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    let url =
      "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + this.state.page;

    this.setState({ total: this.getData(url).then((data) => data.total) });
    this.getData(url).then((data) => {
      this.setState({ total: data.total });
      this.setState({
        cards: this.state.cards.concat(data.cards),
      });
      this.setState({ isLoading: false });
    });
    this.setState({ page: this.state.page + 1 });
  };

  async getData(url) {
    return fetch(url)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.detail[0].msg) || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .then((data) => {
        let cardArray = data;
        let total = cardArray.slice(-1)[0];
        cardArray.pop();
        return { total: total, cards: cardArray };
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "There was an error! " + error });
      });
  }

  orderBy = (order) => {
    if (order === "year") {
      this.setState({ isLoading: true });
      this.setState({ cards: [] });
      this.setState({ total: 0 });
      let m = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
      let url =
        "https://api.debatev.com/api/v1/search?q=" +
        m +
        "&p=" +
        0 +
        "&order=year";
      this.getData(url).then((data) => {
        this.setState({ total: data.total });
        this.setState({
          cards: data.cards,
        });
        this.setState({ isLoading: false });
      });
    } else {
      this.setState({ isLoading: true });
      this.setState({ cards: [] });
      this.setState({ total: 0 });
      let m = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
      let url = "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + 0;
      this.getData(url).then((data) => {
        this.setState({ total: data.total });
        this.setState({
          cards: data.cards,
        });
        this.setState({ isLoading: false });
      });
    }
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
              loading="lazy"
              src={debatevsquarefinal}
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
            <SearchBox getUrl={getUrl} />
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
              <Filters /> <div style={{ width: "9%", color: "#32a852" }} />
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
            <DropdownButton
              id="dropdown-basic-button"
              style={{
                borderWidth: 0,
                position: "absolute",
                right: 15,
                top: -50,
              }}
              title={
                "1" +
                " - " +
                (this.state.amt * this.state.page > this.state.total
                  ? this.state.total
                  : this.state.amt * this.state.page) +
                " of " +
                this.state.total
              }
            >
              <Dropdown.Header>Sort By:</Dropdown.Header>
              <Dropdown.Item
                as="button"
                onClick={() => this.orderBy("relevance")}
              >
                Relevance
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => this.orderBy("year")}>
                Year
              </Dropdown.Item>
            </DropdownButton>
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
                this.state.isLoading && this.state.error === "" ? (
                  <img
                    className="loadinggif"
                    style={{
                      width: 150,
                      height: 150,
                      position: "absolute",
                      left: "40%",
                      right: "50%",
                    }}
                    src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                    alt="Loading..."
                  ></img>
                ) : (
                  <h4>No more cards to display.</h4>
                )
              }
            >
              {this.state.cards.map((card) => {
                if (card["source"].tag.length < 700) {
                  return <CardPreview key={card[0]} cardData={card} />;
                }
                return null;
              })}
            </InfiniteScroll>

            {this.state.cards.length === 0 && !this.state.isLoading ? (
              <Card style={{ borderWidth: 0 }}>No Results have been found</Card>
            ) : null}
            {this.state.error ? (
              <Card style={{ borderWidth: 0 }}>{this.state.error}</Card>
            ) : null}
          </Card>
          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>
      </div>
    );
  }
}

export default DisplayResults;
