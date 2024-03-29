/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { Download, XCircleFill } from "react-bootstrap-icons";
import { logEvent } from "firebase/analytics";
import { doc, setDoc } from "firebase/firestore/lite";
import { useContext } from "react";
import { FirebaseContext } from "../App";
import Tooltip from "@material-ui/core/Tooltip";

export default function CardPreview(props) {
  const [visible, setVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dtype, setDtype] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const firebase = useContext(FirebaseContext);
  let savedCards = firebase.savedCards;
  let setSavedCards = firebase.setSaved;
  let analytics = firebase.analytics;
  let navigate = useNavigate();
  let db = firebase.db;
  let uid = firebase.uid;

  useEffect(() => {
    savedCards = firebase.savedCards;
    if (savedCards) {
      let m;
      if (
        localStorage.getItem("saved") &&
        !savedCards?.includes(localStorage.getItem("saved"))
      ) {
        m = savedCards + "," + localStorage.getItem("saved");
      }
      setSavedCards(m);
      if (window.location.href === window.location.origin + "/saved") {
        setSaved(true);
      } else {
        setSaved(savedCards?.split(",").includes(props.cardData["id"]));
      }
    } else {
      setSavedCards(localStorage.getItem("saved"));
      if (window.location.href === window.location.origin + "/saved") {
        setSaved(true);
      } else {
        setSaved(
          localStorage
            .getItem("saved")
            ?.split(",")
            .includes(props.cardData["id"])
        );
      }
    }
  }, []);

  function getWikiPage(url) {
    if (url.slice(8).split(".")[0] !== "api") {
      let dtype = url.slice(8).split(".")[0];
      if (
        props.cardData["source"].year <= 2022 &&
        props.cardData["source"].year > 2019
      ) {
        if (dtype === "opencaselist") {
          if (parseInt(props.cardData["source"].year) === 2022) {
            dtype =
              "ndtceda" + String(props.cardData["source"].year - 1).slice(-2);
          } else {
            dtype = "ndtceda" + props.cardData["source"].year.slice(-2);
          }
        } else {
          if (parseInt(props.cardData["source"].year) === 2022) {
            dtype = dtype + String(props.cardData["source"].year - 1).slice(-2);
          } else {
            dtype = dtype + props.cardData["source"].year.slice(-2);
          }
        }
      } else {
        if (parseInt(props.cardData["source"].year) !== 2022) {
          if (dtype.slice(0, -2) === "opencaselist") {
            dtype = "ndtceda" + dtype.slice(-2);
          }
        } else {
          if (dtype === "opencaselist") {
            dtype = "ndtceda";
          }
        }
      }
      const school = url.split("/")[4].replaceAll("%20", "");
      let debater = url.split("/")[5];
      if (debater.lastIndexOf("-") > 0) {
        debater =
          debater.slice(0, 2) +
          debater.slice(
            debater.lastIndexOf("-") + 1,
            debater.lastIndexOf("-") + 3
          );
      } else {
        debater = "";
      }
      debater = debater.replace("%", "");

      let round = "";
      if (dtype.includes("hsld") || dtype.includes("openev")) {
        round = "";
      } else {
        round = url.split("/")[6].split("?")[0];
        if (round.lastIndexOf("Aff") > 0) {
          round = "Aff";
        } else {
          round = "Neg";
        }
      }

      return (
        "https://opencaselist.com/" +
        dtype +
        "/" +
        school +
        "/" +
        debater +
        "/" +
        round
      );
    } else {
      let baseURL = url.split("=")[1];
      console.log(baseURL);
      let dtype = baseURL.split("/")[0];
      let school = baseURL.split("/")[1];
      let debater = "";
      if (dtype !== "openev") {
        debater = baseURL.split("/")[2];
      }
      let round = "";
      if (dtype.includes("hsld") || dtype.includes("openev")) {
        round = "";
      } else {
        round = baseURL.split("/")[3];
        if (round.lastIndexOf("Aff") > 0) {
          round = "Aff";
        } else {
          round = "Neg";
        }
      }
      return (
        "https://opencaselist.com/" +
        dtype +
        "/" +
        school +
        "/" +
        debater +
        "/" +
        round
      );
    }
  }

  function convertToNewUrl(url) {
    if (url.slice(8).split(".")[0] !== "api") {
      let dtype = url.slice(8).split(".")[0];
      if (
        props.cardData["source"].year <= 2022 &&
        props.cardData["source"].year > 2019
      ) {
        if (dtype === "opencaselist") {
          if (parseInt(props.cardData["source"].year) === 2022) {
            dtype =
              "ndtceda" + String(props.cardData["source"].year - 1).slice(-2);
          } else {
            dtype = "ndtceda" + props.cardData["source"].year.slice(-2);
          }
        } else {
          if (parseInt(props.cardData["source"].year) === 2022) {
            dtype = dtype + String(props.cardData["source"].year - 1).slice(-2);
          } else {
            dtype = dtype + props.cardData["source"].year.slice(-2);
          }
        }
      } else {
        if (parseInt(props.cardData["source"].year) !== 2022) {
          if (dtype.slice(0, -2) === "opencaselist") {
            dtype = "ndtceda" + dtype.slice(-2);
          }
        } else {
          if (dtype === "opencaselist") {
            dtype = "ndtceda";
          }
        }
      }
      const school = url.split("/")[4].replaceAll("%20", "");
      let debater = url.split("/")[5];
      if (debater.lastIndexOf("-") > 0) {
        debater =
          debater.slice(0, 2) +
          debater.slice(
            debater.lastIndexOf("-") + 1,
            debater.lastIndexOf("-") + 3
          );
      } else if (dtype !== "openev") {
        debater = debater.slice(0, 2);
      }
      debater = debater.replace("%", "");

      let round = url.split("/")[6].split("?")[0];
      if (dtype !== "openev") {
        round = round.replaceAll("%20", "%2520");
      }

      return (
        "https://api.opencaselist.com/v1/download?path=" +
        dtype +
        "%2F" +
        school +
        "%2F" +
        debater +
        "%2F" +
        round
      );
    } else {
      return url;
    }
  }
  function openModal() {
    setVisible(true);
    let location = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    let destination =
      location === "imfeelinglucky" || location === "saved"
        ? "/" + location
        : "/search/" + props.cardData["id"];
    setSearchTerm(window.location.href);
    logEvent(analytics, "card_click", {
      card_url: "https://www.debatev.com" + destination,
      search_term: window.location.href,
    });
    navigate(destination);
  }
  function closeModal() {
    setVisible(false);
    navigate(-1);
  }
  useEffect(() => {
    let x = props.cardData["source"].filepath;
    x = x
      .substring(x.lastIndexOf("/") + 1)
      .replaceAll("%20", " ")
      .replaceAll("%2520", " ")
      .replaceAll("-", " ");
    x = x.substring(0, x.lastIndexOf("doc") - 1);

    setCardName(x);

    switch (props.cardData["dtype"]) {
      case "college":
        setDtype("College Policy");
        break;
      case "ld":
        setDtype("High School LD");
        break;
      case "hspolicy":
        setDtype("High School Policy");
        break;
      case "openev":
        setDtype("OpenEv");
        break;
      case "pf":
        setDtype("PF");
        break;
      case "collegeld":
        setDtype("NFA LD");
        break;
      default:
        break;
    }
  }, [props.cardData, saved]);

  async function unsaveCard(cardID) {
    //FIXME: make work on saved page
    setSaved(false);
    let saved = [];
    saved = savedCards.split(",");
    let foundIndex = saved.indexOf(cardID);
    saved.splice(foundIndex, 1);

    setSavedCards(saved.join(","));
    if (uid) {
      await setDoc(doc(db, "user-saved-cards", uid), {
        saved: saved.join(","),
      });
    }
    localStorage.setItem("saved", saved);
    if (window.location.href === window.location.origin + "/saved") {
      window.location.replace(window.location.origin + "/saved");
    }
  }

  async function saveCard(cardID) {
    //FIX: repeated cardIDs in cloud firestore and for users not signed in
    setSaved(true);
    let saved = [];
    logEvent(analytics, "card_save", {
      card_url: window.location.href,
      search_term: searchTerm,
    });
    console.log(savedCards);
    if (savedCards) {
      saved.push(savedCards);
      saved.push(cardID);
    } else {
      saved.push(cardID);
    }
    setSavedCards(saved.join(","));
    if (uid) {
      await setDoc(doc(db, "user-saved-cards", uid), {
        saved: saved.join(","),
      });
    }

    localStorage.setItem("saved", saved);
  }

  return (
    <div>
      <Card className="cardhtml" style={{ borderWidth: 0 }}>
        <div
          style={{
            maxHeight: 297,
          }}
          dangerouslySetInnerHTML={{
            __html: props.cardData["source"].cardHtml,
          }}
          onClick={() => openModal()}
        />
      </Card>
      <Button onClick={openModal}>Open</Button>
      <Card style={{ height: 100, borderWidth: 0 }} />

      <Modal
        scrollable={true}
        show={visible}
        onHide={closeModal}
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm">
            <Tooltip title="You have to be logged into the wiki to download cards">
              <Button
                className="filename"
                style={{
                  height: "30",
                  backgroundColor: "#FFF",
                  color: "#000",
                  borderWidth: 0,
                  position: "relative",
                  left: 0,
                  fontSize: 18,
                }}
                onClick={() => {
                  console.log(props.cardData["source"].filepath);
                  window.location.href = convertToNewUrl(
                    props.cardData["source"].filepath
                  );
                }}
              >
                {cardName}
              </Button>
            </Tooltip>
            {""}
          </Modal.Title>
          <DropdownButton
            id="dropdown-basic-button"
            title="More Info"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            show={open}
          >
            <Dropdown.Item>
              {"Year: " + props.cardData["source"].year}
            </Dropdown.Item>
            <Dropdown.Item>{"From: " + dtype}</Dropdown.Item>
            <Tooltip title="You have to be logged into the wiki to download cards">
              <Dropdown.Item
                href={convertToNewUrl(props.cardData["source"].filepath)}
              >
                Download Case
              </Dropdown.Item>
            </Tooltip>
            <Dropdown.Item
              onClick={() => {
                window.open(
                  getWikiPage(props.cardData["source"].filepath),
                  "_blank"
                );
              }}
            >
              Go to Wiki Page
            </Dropdown.Item>
          </DropdownButton>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: props.cardData["source"].cardHtml,
            }}
          />
        </Modal.Body>

        <Modal.Footer style={{ flex: 1 }}>
          <Button
            style={{
              backgroundColor: "#1C86EE",
              color: "#FFF",
              borderWidth: 0,
              position: "absolute",
              left: 5,
            }}
            onClick={() => {
              window.location.href =
                "https://api.debatev.com/api/v1/download?q=" +
                props.cardData["id"];
            }}
          >
            <Download /> Download
          </Button>
          {saved ? (
            <Button
              variant="danger"
              style={{
                borderWidth: 0,
                width: "100px",
              }}
              onClick={() => {
                unsaveCard(props.cardData["id"]);
              }}
            >
              Unsave
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "#1C86EE",
                color: "#FFF",
                borderWidth: 0,
                width: "100px",
              }}
              onClick={() => {
                saveCard(props.cardData["id"]);
              }}
            >
              Save
            </Button>
          )}
          <Button
            variant="danger"
            style={{ width: "100px" }}
            onClick={closeModal}
          >
            <XCircleFill /> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
