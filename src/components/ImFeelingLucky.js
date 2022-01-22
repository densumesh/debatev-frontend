/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardPreview from "../utils/CardPreview";

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

class ImFeelingLucky extends Component {
  state = { ref: "", page: 0, cards: [], search: "", isLoading: -1 };
  componentDidMount = () => {
    let url = "https://api.debatev.com/api/v1/cards/imfeelinglucky";
    document.addEventListener("keydown", this.escFunction, false);
    console.log(url);
    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });

      this.setState({ cards: array });
      this.setState({ isLoading: 0 });
    });
  };

  goToPage = () => {
    window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

    let url = "https://api.debatev.com/api/v1/cards/imfeelinglucky";

    console.log(url);
    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });

      this.setState({ cards: array });
    });
  };

  escFunction(event) {
    if (event.keyCode === 13) {
      window.location.href = "/imfeelinglucky";
    }
  }

  async getData(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
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
              src={
                "https://ik.imagekit.io/vfpouuewr1ci/debatevsquarefinal_t6mIX8XIt.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1642690334995"
              }
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
              <CardPreview cardData={card} />
            ))}
            {this.state.isLoading === -1 ? (
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
          </Card>

          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>{" "}
      </div>
    );
  }
}

export default ImFeelingLucky;
