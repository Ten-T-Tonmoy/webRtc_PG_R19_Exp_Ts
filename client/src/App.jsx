import React from "react";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import toast, { Toaster } from "react-hot-toast";
import { Link, Routes, Route } from "react-router-dom";

const App = () => {
  const sendToast = () => {
    toast.success("toast worked ");
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className="
            bg-red-400
            p-2   m-10
            rounded-md 
            text-white text-center text-[3rem]
            "
      >
        Tailwind Working
      </div>
      <Link to="/home">
        <div>
          <button onClick={sendToast} className="btn btn-primary">
            click to check route and hot toast
          </button>
        </div>
      </Link>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
};

export default App;
