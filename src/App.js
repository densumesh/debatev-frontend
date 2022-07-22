import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG,
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

const HomePage = lazy(() => import("./pages/HomePage"));
const DisplayResults = lazy(() => import("./pages/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./pages/ImFeelingLucky"));
const SavedCards = lazy(() => import("./pages/savedCards"));

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <Routes>
          <Route
            path="/imfeelinglucky"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ImFeelingLucky app={app} />
              </Suspense>
            }
          />
          <Route
            path="/search/:id"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DisplayResults app={app} />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DisplayResults app={app} />
              </Suspense>
            }
          />
          <Route
            path="/saved"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SavedCards app={app} />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage app={app} />
              </Suspense>
            }
          />
          <Route
            path="/privacyPolicy.html"
            render={() => <Link push to={"../public/privacyPolicy.html"} />}
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
