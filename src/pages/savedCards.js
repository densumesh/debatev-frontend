/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardPreview from "../components/CardPreview";
import { XCircle, Download } from "react-bootstrap-icons";
import debatevsquarefinal from "../Logo/debatevsquarefinal.svg";

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

class SavedCards extends Component {
  state = { ref: "", page: 1, cards: [], search: "", isLoading: -1, error: "" };

  componentDidMount = () => {
    let m = localStorage.getItem("saved");
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
      .catch((error) => {
        this.setState({ error: "There was an error! " + error });
      });
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
        </Card>{" "}
        <Button
          style={{
            backgroundColor: "#1C86EE",
            color: "#FFF",
            borderWidth: 0,
            position: "absolute",
            top: 15,
            right: 60,
            marginRight: 10,
          }}
          onClick={() => {
            window.location.href =
              "https://api.debatev.com/api/v1/download?q=" +
              localStorage.getItem("saved");
          }}
          disabled={localStorage.getItem("saved") === null}
        >
          <Download /> Download
        </Button>
        <Button
          style={{
            backgroundColor: "#1C86EE",
            color: "#FFF",
            borderWidth: 0,
            position: "absolute",
            top: 15,
            right: 190,
            marginRight: 10,
          }}
          onClick={() => {
            localStorage.removeItem("saved");
            window.location.reload();
          }}
          disabled={localStorage.getItem("saved") === null}
        >
          <XCircle /> Clear
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
              <CardPreview key={card[0]} cardData={card} />
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
            {this.state.cards.length === 0 && this.state.isLoading !== -1 ? (
              <Card style={{ borderWidth: 0 }}>
                No Saved Cards. Go Save Some Cards!
              </Card>
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

export default SavedCards;
