import React, { useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { usePeerContext } from "../../context/PeerContext";

const Make_a_Call = ({ targetEmail }) => {
  const socket = useSocketContext();
  const { createOffer } = usePeerContext();

  const handleCallUser = async () => {
    if (!targetEmail) return;
    const offer = await createOffer();
    socket.emit("call-user", {
      email: targetEmail,
      offer,
    });
    console.log("Calling user:", targetEmail);
  };
  return (
    <>
      <div className="py-4">
        <h1>List of Participants :</h1>
        {targetEmail === "" ? "N/A" : targetEmail}
      </div>
      <div className="">
        <button
          onClick={handleCallUser}
          className="btn btn-primary
       rounded-full"
        >
          Make a Call
        </button>
      </div>
    </>
  );
};

export default Make_a_Call;
