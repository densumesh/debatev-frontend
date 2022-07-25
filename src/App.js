import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

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

export const FirebaseContext = React.createContext({
  db: null,
  analytics: null,
  auth: null,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});
const db = getFirestore(app);

const HomePage = lazy(() => import("./pages/HomePage"));
const DisplayResults = lazy(() => import("./pages/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./pages/ImFeelingLucky"));
const SavedCards = lazy(() => import("./pages/savedCards"));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db,
      analytics: analytics,
      auth: auth,
    };
  }

  render() {
    return (
      <FirebaseContext.Provider value={this.state}>
        <Router>
          <Routes>
            <Route
              path="/imfeelinglucky"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ImFeelingLucky />
                </Suspense>
              }
            />
            <Route
              path="/search/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DisplayResults />
                </Suspense>
              }
            />
            <Route
              path="/search"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DisplayResults />
                </Suspense>
              }
            />
            <Route
              path="/saved"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SavedCards />
                </Suspense>
              }
            />
            <Route
              path="/"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/privacyPolicy.html"
              render={() => <Link push to={"../public/privacyPolicy.html"} />}
            />
          </Routes>
        </Router>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
