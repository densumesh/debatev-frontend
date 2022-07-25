/* eslint-disable jsx-a11y/alt-text */
import React, { Component, lazy } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { XCircle, Download } from "react-bootstrap-icons";
import debatevsquarefinal from "../Logo/debatevsquarefinal.svg";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { FirebaseContext } from "../App";

const CardPreview = lazy(() => import("../components/CardPreview"));
const LoginButton = lazy(() => import("../components/LoginButton"));

if (JSON.parse(localStorage.getItem("isDark"))) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

class SavedCards extends Component {
  state = {
    ref: "",
    page: 1,
    cards: [],
    saved: "",
    isLoading: -1,
    error: "",
    loggedIn: false,
    userInfo: null,
    db: null,
  };

  constructor(props) {
    super(props);
    this.search = React.createRef();
  }
  //TODO: change back to componentDidMount
  componentDidMount = () => {
    let firebase = this.context;
    console.log(firebase);
    let auth = firebase.auth;
    let db = firebase.db;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.setState({ db: db });
        const docRef = doc(db, "user-saved-cards", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.setState({ loggedIn: true });
          this.setState({ userInfo: user });
          let m = "";
          m = docSnap.data().saved;
          if (
            localStorage.getItem("saved") &&
            !docSnap.data().saved?.includes(localStorage.getItem("saved"))
          ) {
            m = m + "," + localStorage.getItem("saved");
            await setDoc(docRef, { saved: m });
          }
          let url = "https://api.debatev.com/api/v1/saved?q=" + m;

          this.getData(url).then((data) => {
            let object = data;
            let array = Object.keys(object).map(function (k) {
              return object[k];
            });
            this.setState({ cards: array });
            this.setState({ isLoading: 0 });
          });
          this.setState({ saved: m });
        } else {
          this.setState({ isLoading: 0 });
          let m = localStorage.getItem("saved");
          this.setState({ saved: m });
          if (m) {
            await setDoc(doc(db, "user-saved-cards", user.uid), {
              saved: m,
            });
            let url = "https://api.debatev.com/api/v1/saved?q=" + m;

            this.getData(url).then((data) => {
              let object = data;
              let array = Object.keys(object).map(function (k) {
                return object[k];
              });
              this.setState({ cards: array });
              this.setState({ isLoading: 0 });
            });
          } else {
            this.setState({ isLoading: 0 });
          }
        }
      } else {
        this.setState({ loggedIn: false });
        let m = localStorage.getItem("saved");
        this.setState({ saved: m });
        if (m) {
          let url = "https://api.debatev.com/api/v1/saved?q=" + m;

          this.getData(url).then((data) => {
            let object = data;
            let array = Object.keys(object).map(function (k) {
              return object[k];
            });
            this.setState({ cards: array });
            this.setState({ isLoading: 0 });
          });
        } else {
          this.setState({ isLoading: 0 });
        }
      }
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
              "https://api.debatev.com/api/v1/download?q=" + this.state.saved;
          }}
          disabled={
            //TODO; Get downloads to download all cards even if not in LocalStorage
            !this.state.saved
          }
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
          onClick={async () => {
            localStorage.removeItem("saved");
            if (this.state.loggedIn) {
              await setDoc(
                doc(this.state.db, "user-saved-cards", this.state.userInfo.uid),
                {
                  saved: "",
                }
              );
            }
            window.location.reload();
          }}
          disabled={
            //TODO: Get clearing to delete all of the user document fields
            !this.state.saved
          }
        >
          <XCircle /> Clear
        </Button>
        <LoginButton
          style={{
            backgroundColor: "#1C86EE",
            color: "#FFF",
            borderWidth: 0,
            position: "absolute",
            top: 15,
            right: 290,
            marginRight: 10,
          }}
        ></LoginButton>
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

SavedCards.contextType = FirebaseContext;
export default SavedCards;
