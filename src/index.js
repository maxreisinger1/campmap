/**
 * @fileoverview Entry point for the Creator Camp Map React application
 * @author Bart Tynior
 * @version 1.0.0
 * @date 2025-08-25
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./utils/reportWebVitals";

/**
 * Application root element and rendering setup.
 *
 * Creates the React root and renders the main App component with StrictMode
 * for additional development checks and warnings.
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
