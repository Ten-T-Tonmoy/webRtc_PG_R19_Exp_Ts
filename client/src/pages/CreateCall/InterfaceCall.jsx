import React, { useCallback, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { usePeerContext } from "../../context/PeerContext";

const InterfaceCall = () => {
  //existing user current socket will make offer:sdp
  const socket = useSocketContext();
  const { peer, createOffer } = usePeerContext();

  const handleNewUserJoining = useCallback(
    async (data) => {
      const { email } = data;
      console.log("new user joined room", email);
      const offer = await createOffer();
      socket.emit("call-user", { email, offer });
    },
    [createOffer, socket]
  );
  const handleIncomingCall = useCallback((data) => {
    const { from, offer } = data;
    console.log("incoming call from ", from, "His offer ", offer);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoining);
    socket.on("incoming-call", handleIncomingCall);

    return () => {
      //dont cleanup socket?
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [handleNewUserJoining, socket]);
  return <div>InterfaceCall</div>;
};

export default InterfaceCall;
