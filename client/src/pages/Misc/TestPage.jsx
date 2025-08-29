import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const TestPage = () => {
  const sendToast = () => {
    toast.success("toast worked ");
  };
  return (
    <div className="w-screen bg-white h-screen flex flex-col items-center p-10 gap-4">
      <div
        className="
            btn btn-neutral
            "
      >
        Tailwind Working <span className="loading "></span>
      </div>
      <button onClick={sendToast} className="btn btn-secondary">
        click to check Hot Toast
      </button>
      <Link to="/home">
        <div>
          <button className="btn btn-primary">Go to Home</button>
        </div>
      </Link>
      <Link to="/call">
        <div>
          <button className="btn btn-primary">Create call</button>
        </div>
      </Link>
      <Link to="/call/:id">
        <div>
          <button className="btn btn-primary">Call Interface</button>
        </div>
      </Link>
      <Link to="/socket">
        <div>
          <button className="btn btn-warning">Socket check</button>
        </div>
      </Link>
    </div>
  );
};

export default TestPage;
