/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardPreview from "../components/CardPreview";
import debatevsquarefinal from "../Logo/debatevsquarefinal.svg";

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

class ImFeelingLucky extends Component {
  state = { cards: [], isLoading: -1, error: "" };
  componentDidMount = () => {
    let url = "https://api.debatev.com/api/v1/cards/imfeelinglucky";
    document.addEventListener("keydown", this.escFunction, false);
    this.getData(url).then((data) => {
      this.setState({ cards: data });
      this.setState({ isLoading: 0 });
    });
  };

  goToPage = () => {
    window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

    let url = "https://api.debatev.com/api/v1/cards/imfeelinglucky";

    this.getData(url).then((data) => {
      this.setState({ cards: data });
    });
  };

  escFunction(event) {
    if (event.keyCode === 13) {
      window.location.href = "/imfeelinglucky";
    }
  }

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

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  render() {
    return (
      <div>
        {" "}
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
          <div style={{ width: "80%" }} />
          <Button
            className="luckybutton"
            variant="outline-primary"
            style={{
              borderWidth: 1,
              width: "25%",
              height: "10%",
              flexGrow: true,
              color: "#001040",
              marginTop: 0,
            }}
            onClick={() => {
              window.location.href = "/imfeelinglucky";
            }}
          >
            {" "}
            I'm Feeling Luckier{" "}
          </Button>

          <div style={{ width: "80%", height: 60 }} />
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",

            flexDirection: "row",
          }}
        >
          <Card style={{ flex: 1, borderWidth: 0 }} />
          <Card style={{ flex: 15, borderWidth: 0, marginTop: 10 }}>
            {this.state.cards.map((card) => (
              <CardPreview key={card[0]} cardData={card} />
            ))}
            {this.state.isLoading === -1 && !this.state.error ? (
              <img
                className="loadinggif"
                style={{
                  width: 150,
                  height: 150,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                alt={"Loading..."}
              />
            ) : null}
            {this.state.error ? <div>{this.state.error}</div> : null}
          </Card>

          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>{" "}
      </div>
    );
  }
}

export default ImFeelingLucky;
