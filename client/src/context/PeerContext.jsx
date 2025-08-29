import React, { createContext, useContext, useMemo, useState } from "react";

const PeerContext = createContext(null);

export const usePeerContext = () => useContext(PeerContext);

export const PeerContextProvider = ({ children }) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // basic STUN
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    //will save on local state
    return offer;
  };
  return (
    <PeerContext.Provider value={{ peer, createOffer }}>
      {/* wrapper */}
      {children}
    </PeerContext.Provider>
  );
};
