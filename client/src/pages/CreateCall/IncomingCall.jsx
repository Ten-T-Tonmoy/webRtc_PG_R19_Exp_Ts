import React, { useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { usePeerContext } from "../../context/PeerContext";

const IncomingCall = ({ callIncoming }) => {
  const socket = useSocketContext();
  const { createAnswer } = usePeerContext();

  const handleAcceptCall = async () => {
    console.log(
      "incoming call from ",
      callIncoming.sender,
      "His offer ",
      callIncoming.offer
    );
    const ans = await createAnswer(callIncoming.offer);
    socket.emit("call-accepted", { callerEmail: callIncoming.sender, ans });
  };
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen
    bg-black/70 flex justify-center items-center"
    >
      <div
        className="bg-primary p-10 w-1/2 rounded-3xl
       flex flex-col items-center justify-center"
      >
        <div className="flex flex-col justify-center">
          <h1>Call incoming from : </h1>
          <p> {callIncoming.sender}</p>
        </div>
        <div className="gap-4 flex p-4 ">
          <button
            onClick={handleAcceptCall}
            className="btn btn-warning text-white"
          >
            Accept {callIncoming.sender !== "" && <div className="loading" />}
          </button>
          <button className="btn btn-error text-white">Reject</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
