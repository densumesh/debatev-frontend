/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import debateEV from "../Logo/debatevsquarefinal.svg";
import CardPreview from "../utils/CardPreview";
import { CacheableResponse } from "workbox-cacheable-response";

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

class SavedCards extends Component {
  state = { ref: "", page: 1, cards: [], search: "", isLoading: -1 };

  componentDidMount = () => {
    let m = localStorage.getItem("saved");
    console.log(m);
    this.setState({ search: m });
    let url = "https://api.debatev.com/api/v1/saved?q=" + m;

    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ cards: array });
      this.setState({ isLoading: 0 });
    });
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
              cache.put(url, response);
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
  constructor(props) {
    super(props);
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
            height: 100,
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
        </Card>{" "}
        <Button
          style={{
            backgroundColor: "#1C86EE",
            color: "#FFF",
            borderWidth: 0,
            position: "absolute",
            top: 15,
            right: 130,
            marginRight: 10,
          }}
          onClick={() => {
            window.location.href =
              "https://api.debatev.com/api/v1/download?q=" +
              localStorage.getItem("saved");
          }}
          disabled={localStorage.getItem("saved") === null}
        >
          Download Cards
        </Button>
        <Button
          style={{
            backgroundColor: "#1C86EE",
            color: "#FFF",
            borderWidth: 0,
            position: "absolute",
            top: 15,
            right: 280,
            marginRight: 10,
          }}
          onClick={() => {
            localStorage.removeItem("saved");
            window.location.reload();
          }}
          disabled={localStorage.getItem("saved") === null}
        >
          Clear Cards
        </Button>
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
          <Card style={{ flexDirection: "column", flex: 15, borderWidth: 0 }}>
            {this.state.cards.map((card) => (
              <CardPreview cardData={card} />
            ))}
            {this.state.cards.length !== 0 && this.state.isLoading === -1 ? (
              <img
                className="loadinggif"
                style={{
                  width: 150,
                  height: 150,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                alt={"loading"}
              />
            ) : null}
            {this.state.cards.length === 0 && this.state.isLoading === -1 ? (
              <Card style={{ borderWidth: 0 }}>
                No Saved Cards. Go Save Some Cards!
              </Card>
            ) : null}
          </Card>
          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>
      </div>
    );
  }
}

export default SavedCards;
