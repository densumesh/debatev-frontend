import axios from "axios";
import React, { Component } from "react";
import {
  Button,
  Card
} from "react-bootstrap";
import debateEV from "../Logo/debatevsquarefinal.svg";
import CardPreview from "./CardPreview";

if (JSON.parse(localStorage.getItem('isDark'))) {
        document.documentElement.classList.add('dark')
} else {
        document.documentElement.classList.remove('dark')
}
class ImFeelingLucky extends Component {
  state = { ref: "", page: 0, cards: [], search: "", isLoading: -1 };
  componentDidMount = () => {
    // let url =
    // "http://debatebackend-env.eba-tk2pwnim.us-west-1.elasticbeanstalk.com/api/v1/search?q=kljsdhfaskjdgfkasjddgfaskjdgfhjdgfasgfhjs&p=0";
    let url = "https://api.debatev.com/api/v1/cards/imfeelinglucky";
    document.addEventListener("keydown", this.enterFunction, false);
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

  goToPage = (page) => {
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

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
  
  escFunction(event){
    if(event.keyCode === 13) {
       window.location.href = "/imfeelinglucky";
    }
  }

  async getData(url) {
    let data = await axios.get(url);
    console.log(data.data);
    return data.data;
  }

  constructor() {
    super();
    this.search = React.createRef();
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }
  render() {
    return (
      <div>
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
          <div style={{ width: "80%" }} />
          <Button
            className="luckybutton"
            variant="outline-primary"
            style={{ borderWidth: 1, width: "25%", height: "10%", flexGrow: true, color: "#001040", marginTop: 0 }}
            onClick={(e) => {
              window.location.href = "/imfeelinglucky";
            }}
          >
            {" "}
            I'm Feeling Luckier{" "}
          </Button>
          <div style={{ width: 150 }} />
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "50%",
              height: 60,
            }}
          ></div>
          <div style={{ width: "40%" }} />
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
          <Card style={{ flex: 15, borderWidth: 0, marginTop:10 }}>
            {this.state.cards.map((card) => (
              <CardPreview cardData={card} />
            ))}
            {this.state.isLoading === -1 ? (
              <img className="loadinggif" style ={{width: 150, height:150, marginLeft: "auto", marginRight: "auto"}}src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif">
              </img>
            ) : null}
          </Card>
          
          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>{" "}
      </div>
    );
  }
}

export default ImFeelingLucky;
