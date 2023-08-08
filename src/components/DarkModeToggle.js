import Button from "react-bootstrap/Button";
import React, { useState } from "react";

export default function DarkToggle() {
  let [buttonText, setButtonText] = useState(
    JSON.parse(localStorage.getItem("isDark")) ? "Light Theme" : "Dark Theme",
  );
  function DarkToggle(event) {
    const DARK_CLASS = "dark";
    window.localStorage.setItem("isDark", JSON.stringify(event));
    if (JSON.parse(window.localStorage.getItem("isDark"))) {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  }

  function ButtonTextChange() {
    if (JSON.parse(localStorage.getItem("isDark"))) {
      setButtonText("Light Theme");
    } else {
      setButtonText("Dark Theme");
    }
  }
  return (
    <Button
      style={{
        backgroundColor: "#1C86EE",
        color: "#FFF",
        borderWidth: 0,
        position: "absolute",
        top: 45,
        right: "1%",
        marginTop: "5px",
        zIndex: 100,
      }}
      onClick={(_e) => {
        DarkToggle(!JSON.parse(localStorage.getItem("isDark")));
        ButtonTextChange();
      }}>
      {buttonText}
    </Button>
  );
}
