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
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { useContext } from "react";
import { FirebaseContext } from "../App";

export default function CardPreview(props) {
  const [visible, setVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dtype, setDtype] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedCards, setSavedCards] = useState("");
  const [user, setUser] = useState(null);
  const firebase = useContext(FirebaseContext);
  let analytics = firebase.analytics;
  let navigate = useNavigate();
  let auth = firebase.auth;
  let db = firebase.db;

  useEffect(() => {
    onAuthStateChanged(auth, async (saver) => {
      if (saver) {
        setUser(saver);
        const docRef = doc(db, "user-saved-cards", saver.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let m = "";
          m = docSnap.data().saved;
          if (
            localStorage.getItem("saved") &&
            !docSnap.data().saved?.includes(localStorage.getItem("saved"))
          ) {
            m = m + "," + localStorage.getItem("saved");
          }
          setSavedCards(m);
          if (window.location.href === window.location.origin + "/saved") {
            setSaved(true);
          } else {
            setSaved(m?.split(",").includes(props.cardData[0]));
          }
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
              .includes(props.cardData[0])
          );
        }
      }
    });
  });

  function convertToNewUrl(url) {
    let dtype = url.slice(8).split(".")[0];
    if (dtype.slice(0, -2) === "opencaselist") {
      dtype = "ndtceda" + dtype.slice(-2);
    }
    const school = url.split("/")[4].replace("%20", "");
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
  }
  function openModal() {
    setVisible(true);
    let location = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    let destination =
      location === "imfeelinglucky" || location === "saved"
        ? "/" + location
        : "/search/" + props.cardData[0];
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
    let x = props.cardData[1].filepath;
    x = x
      .substring(x.lastIndexOf("/") + 1)
      .replaceAll("%20", " ")
      .replaceAll("-", " ");
    x = x.substring(0, x.lastIndexOf("doc") - 1);

    setCardName(x);

    switch (props.cardData[2].replace("dtype: ", "")) {
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
      default:
        break;
    }
  }, [props.cardData, saved]);

  async function unsaveCard(cardID) {
    //TODO: Work with Database
    setSaved(false);
    let saved = [];
    saved = savedCards.split(",");
    let foundIndex = saved.indexOf(cardID);
    saved.splice(foundIndex, 1);
    setSavedCards(saved.join(","));
    if (user) {
      await setDoc(doc(db, "user-saved-cards", user.uid), {
        saved: saved.join(","),
      });
    }
    localStorage.setItem("saved", saved);
    if (window.location.href === window.location.origin + "/saved") {
      window.location.reload();
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

    if (savedCards) {
      saved.push(savedCards);
      saved.push(cardID);
    } else {
      saved.push(cardID);
    }
    setSavedCards(saved.join(","));
    if (user) {
      await setDoc(doc(db, "user-saved-cards", user.uid), {
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
            __html: props.cardData[1].cardHtml,
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
                console.log(props.cardData[1].filepath);
                window.location.href = convertToNewUrl(
                  props.cardData[1].filepath
                );
              }}
            >
              {cardName}
            </Button>
            {""}
          </Modal.Title>
          <DropdownButton
            id="dropdown-basic-button"
            title="More Info"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            show={open}
          >
            <Dropdown.Item>{"Year: " + props.cardData[1].year}</Dropdown.Item>
            <Dropdown.Item>{"From: " + dtype}</Dropdown.Item>
            <Dropdown.Item href={convertToNewUrl(props.cardData[1].filepath)}>
              Download Case
            </Dropdown.Item>
          </DropdownButton>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: props.cardData[1].cardHtml,
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
                props.cardData[0];
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
                unsaveCard(props.cardData[0]);
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
                saveCard(props.cardData[0]);
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
