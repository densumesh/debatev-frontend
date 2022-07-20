import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { Download, XCircleFill } from "react-bootstrap-icons";
import { logEvent } from "firebase/analytics";

export default function CardPreview(props) {
  const [visible, setVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dtype, setDtype] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();

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
    logEvent(props.analytics, "card_click", {
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
    setSaved(
      localStorage.getItem("saved")?.split(",").includes(props.cardData[0])
    );
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
  }, [props.cardData]);

  function unsaveCard(cardID) {
    setSaved(false);
    let saved = [];
    if (localStorage.getItem("saved")) {
      saved = localStorage.getItem("saved").split(",");
      let foundIndex = saved.indexOf(cardID);
      saved.splice(foundIndex, 1);
    }

    if (window.location.href === window.location.origin + "/saved") {
      window.location.reload();
    }
    localStorage.setItem("saved", saved);
  }

  function saveCard(cardID) {
    setSaved(true);
    let saved = [];
    logEvent(props.analytics, "card_save", {
      card_url: window.location.href,
      search_term: searchTerm,
    });
    if (localStorage.getItem("saved")) {
      saved.push(localStorage.getItem("saved"));
      saved.push(cardID);
    } else {
      saved.push(cardID);
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
