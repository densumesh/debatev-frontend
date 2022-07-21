import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPl5-roZAxzowIMHmKRzJY47glocIKwVQ",
  authDomain: "debatev-users.firebaseapp.com",
  databaseURL: "https://debatev-users.firebaseio.com",
  projectId: "debatev-users",
  storageBucket: "debatev-users.appspot.com",
  messagingSenderId: "844695480452",
  appId: "1:844695480452:web:4b2cbfe532132f39e7bad1",
  measurementId: "G-7FYPV5WRF8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
getFirestore(app);

const HomePage = lazy(() => import("./pages/HomePage"));
const DisplayResults = lazy(() => import("./pages/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./pages/ImFeelingLucky"));
const SavedCards = lazy(() => import("./pages/savedCards"));

class App extends Component {
  state = {};

  render() {
    return (
      <Suspense fallback={<div> </div>}>
        <Router>
          <Routes>
            <Route
              path="/imfeelinglucky"
              element={<ImFeelingLucky app={app} />}
            />
            <Route path="/search/:id" element={<DisplayResults app={app} />} />
            <Route path="/search" element={<DisplayResults app={app} />} />
            <Route path="/saved" element={<SavedCards app={app} />} />
            <Route path="/" element={<HomePage app={app} />} />
          </Routes>
        </Router>
      </Suspense>
    );
  }
}

export default App;
