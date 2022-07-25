import { React, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Button, DropdownButton, Dropdown } from "react-bootstrap";
import { useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useContext } from "react";
import { FirebaseContext } from "../App";

export default function LoginButton(props) {
  const firebase = useContext(FirebaseContext);
  const auth = firebase.auth;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buttonText, setButtonText] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setButtonText(user.displayName);
      } else {
        setIsLoggedIn(false);
        setButtonText("");
      }
    });
  });

  function login() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        setIsLoggedIn(true);
        setButtonText(user.displayName);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);

        // ...
      });
  }

  function logout() {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setButtonText("");
    });
  }

  return (
    <>
      {!isLoggedIn ? (
        <Tooltip title="Create an account to sync your saved cards">
          <Button style={props.style} onClick={login}>
            Login / Sign Up
          </Button>
        </Tooltip>
      ) : (
        <DropdownButton title={buttonText} style={props.style}>
          <Dropdown.Item as="button" onClick={logout}>
            Log Out
          </Dropdown.Item>
        </DropdownButton>
      )}
    </>
  );
}
