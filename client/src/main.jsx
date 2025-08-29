import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./context/SocketContext";
import { PeerContextProvider } from "./context/PeerContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PeerContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </PeerContextProvider>
  </BrowserRouter>
);
