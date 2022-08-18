import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserPopupRedirectResolver,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { doc, getDoc } from "firebase/firestore/lite";

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
  popupRedirectResolver: browserPopupRedirectResolver,
});
const db = getFirestore(app);

const HomePage = lazy(() => import("./pages/HomePage"));
const DisplayResults = lazy(() => import("./pages/DisplayResults"));
const ImFeelingLucky = lazy(() => import("./pages/ImFeelingLucky"));
const SavedCards = lazy(() => import("./pages/savedCards"));
let fallback = (
  <img
    className="loadinggif"
    style={{
      width: 150,
      height: 150,
      position: "absolute",
      left: "40%",
      right: "50%",
    }}
    src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
    alt="Loading..."
  ></img>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: db,
      analytics: analytics,
      auth: auth,
      savedCards: "",
      setSaved: (saved) => {
        this.state.savedCards = saved;
      },
      uid: null,
      user: null,
    };
  }
  componentDidMount() {
    onAuthStateChanged(auth, async (saver) => {
      const docRef = doc(db, "user-saved-cards", saver.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.setState({ savedCards: docSnap.data().saved });
      }
      this.setState({ uid: saver.uid });
      this.setState({ user: saver });
    });
  }

  render() {
    return this.state.uid === null && this.state.savedCards === null ? (
      fallback
    ) : (
      <FirebaseContext.Provider value={this.state}>
        <Router>
          <Routes>
            <Route
              path="/imfeelinglucky"
              element={
                <Suspense fallback={fallback}>
                  <ImFeelingLucky />
                </Suspense>
              }
            />
            <Route
              path="/search/:id"
              element={
                <Suspense fallback={fallback}>
                  <DisplayResults />
                </Suspense>
              }
            />
            <Route
              path="/search"
              element={
                <Suspense fallback={fallback}>
                  <DisplayResults />
                </Suspense>
              }
            />
            <Route
              path="/saved"
              element={
                <Suspense fallback={fallback}>
                  <SavedCards />
                </Suspense>
              }
            />
            <Route
              path="/"
              element={
                <Suspense fallback={fallback}>
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
