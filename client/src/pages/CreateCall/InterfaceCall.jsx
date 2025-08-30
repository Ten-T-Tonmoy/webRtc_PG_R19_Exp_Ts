import React, { useCallback, useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { usePeerContext } from "../../context/PeerContext";
import Make_a_Call from "./Make_a_Call";
import IncomingCall from "./IncomingCall";

import ReactPlayer from "react-player";

const InterfaceCall = () => {
  //existing user current socket will make offer:sdp
  const socket = useSocketContext();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeerContext();
  const [targetEmail, setTargetEmail] = useState("");
  const [myStream, setMyStream] = useState(null);
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

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 60 },
      },
    });
    sendStream(stream);
    setMyStream(stream);
  }, []);
  const handleCallAccepted = useCallback(
    async (data) => {
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
      //   socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleNewUserJoining, socket, handleIncomingCall]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);
  return (
    <>
      <h1 className="text-center">InterfaceCall</h1>
      <div className="h-screen relative w-full flex flex-col items-center justify-center">
        {callIncoming.coming && (
          <IncomingCall
            callIncoming={callIncoming}
            setCallIncoming={setCallIncoming}
          />
        )}

        <Make_a_Call targetEmail={targetEmail} />
        <div className="relative">
          <video
            ref={(video) => {
              if (video && remoteStream) {
                video.srcObject = remoteStream;
              }
            }}
            autoPlay
            className="w-[80vw] h-[50vh] object-cover rounded-md bg-black"
            style={{ transform: "scaleX(-1)" }}
          />
          {myStream && (
            <video
              ref={(video) => {
                if (video && myStream) {
                  video.srcObject = myStream;
                }
              }}
              autoPlay
              className="object-cover absolute bottom-0 right-0
            w-30 h-30 rounded-md bg-gray-800"
              style={{ transform: "scaleX(-1)" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default InterfaceCall;
