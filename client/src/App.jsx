import React from "react";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import CreateCallPage from "./pages/CreateCall/CreateCallPage";
import InterfaceCall from "./pages/CreateCall/InterfaceCall";
import { Toaster } from "react-hot-toast";
import { Link, Routes, Route } from "react-router-dom";
import TestPage from "./pages/Misc/TestPage";
import SocketCheck from "./pages/Misc/SocketCheck";

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/socket" element={<SocketCheck />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/call" element={<CreateCallPage />} />
        <Route path="/call/:id" element={<InterfaceCall />} />
      </Routes>
    </>
  );
};

export default App;
