/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { Download, XCircleFill } from "react-bootstrap-icons";
import { logEvent, getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function CardPreview(props) {
  const [visible, setVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dtype, setDtype] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedCards, setSavedCards] = useState("");
  const [user, setUser] = useState(null);
  let analytics = getAnalytics(props.app);
  let navigate = useNavigate();
  let auth = getAuth();
  let db = getFirestore();

  useEffect(() =>
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
        }
      } else {
        setSavedCards(localStorage.getItem("saved"));
      }
    })
  );

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
    if (window.location.href === window.location.origin + "/saved") {
      setSaved(true);
    } else {
      setSaved(savedCards?.split(",").includes(props.cardData[0]));
    }
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
    console.log(savedCards);
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
                window.location.href = props.cardData[1].filepath;
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
            <Dropdown.Item href={props.cardData[1].filepath}>
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
