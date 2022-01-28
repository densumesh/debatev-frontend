import React from "react";
import ReactDOM from "react-dom";
import App from "src/App.js";

it("renders without crashing", () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
