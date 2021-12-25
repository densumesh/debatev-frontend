import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

export default function CardPreview(props) {
  const [visible, setVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dtype, setDtype] = useState("");
  const [open, setOpen] = useState(false);
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
    navigate(destination);
  }
  function closeModal() {
    setVisible(false);
    navigate(-1);
  }
  useEffect(() => {
    let x = props.cardData[1].filepath;
    x = x.substring(x.lastIndexOf("/") + 1);
    x = x.replaceAll("%20", " ");
    x = x.replaceAll("-", " ");
    x = x.substring(0, x.lastIndexOf("doc") - 1);
    setCardName(x);
    setSaved(
      localStorage.getItem("saved")?.split(",").includes(props.cardData[0])
    );
    if (props.cardData[2].replace("dtype: ", "") === "college") {
      setDtype("College Policy");
    } else if (props.cardData[2].replace("dtype: ", "") === "ld") {
      setDtype("High School LD");
    } else if (props.cardData[2].replace("dtype: ", "") === "hspolicy") {
      setDtype("High School Policy");
    } else if (props.cardData[2].replace("dtype: ", "") === "openev") {
      setDtype("OpenEv");
    } else if (props.cardData[2].replace("dtype: ", "") === "pf") {
      setDtype("PF");
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
      <Button onClick={openModal}>Open this card</Button>
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
            Download
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
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
