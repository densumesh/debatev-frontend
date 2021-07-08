/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import debateEV from "../Logo/debatevsquarefinal.svg";
import CardPreview from "../utils/CardPreview";

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
    let data = await axios.get(url);
    console.log(data.data);
    return data.data;
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
              <CardPreview cardData={card} history={this.props.history} />
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
              ></img>
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
