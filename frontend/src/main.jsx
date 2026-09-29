// Import React so JSX can be rendered
import React from "react";

// Import ReactDOM to connect our React application to the HTML page
import ReactDOM from "react-dom/client";

// BrowserRouter enables navigation between different pages
import { BrowserRouter } from "react-router-dom";

// Main application component
import App from "./App.jsx";

// Global CSS file
import "./index.css";

// Start the React application
// BrowserRouter wraps the entire app so all pages can use routing
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);