import React, { useCallback, useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { usePeerContext } from "../../context/PeerContext";
import Make_a_Call from "./Make_a_Call";
import IncomingCall from "./IncomingCall";

const InterfaceCall = () => {
  //existing user current socket will make offer:sdp
  const socket = useSocketContext();
  const { peer, createOffer, createAnswer, setRemoteAns } = usePeerContext();
  const [targetEmail, setTargetEmail] = useState("");
  const [callIncoming, setCallIncoming] = useState({
    coming: false,
    sender: "",
    offer: null,
  });

  const handleNewUserJoining = useCallback(
    async (data) => {
      const { email } = data;
      console.log("new user joined room", email);
      setTargetEmail(email);
      //   const offer = await createOffer();
      //   socket.emit("call-user", {
      //     email,
      //     offer,
      //   });
    },
    [createOffer, socket]
  );
  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      //   console.log("incoming call from ", from, "His offer ", offer);
      //   const ans = await createAnswer(offer);
      //   socket.emit("call-accepted", { callerEmail: from, ans });
      setCallIncoming({ coming: true, sender: from, offer: offer });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      setCallIncoming({
        coming: false,
        sender: "",
        offer: null,
      });
      //fk!!!!!!!!!!!!! beaware of unnecssary wrapping
      const ans = data;
      await setRemoteAns(ans);
      console.log("call-accepted", ans);
    },
    [setRemoteAns]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("user-joined", handleNewUserJoining);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      //dont cleanup socket?
      //   socket.off("incoming-call", handleIncomingCall);
      //   socket.off("user-joined", handleNewUserJoining);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleNewUserJoining, socket, handleIncomingCall]);

  return (
    <>
      <h1 className="text-center">InterfaceCall</h1>
      <div className="h-screen relative w-full flex flex-col items-center justify-center">
        {callIncoming.coming && <IncomingCall callIncoming={callIncoming} />}
        <Make_a_Call targetEmail={targetEmail} />
      </div>
    </>
  );
};

export default InterfaceCall;
