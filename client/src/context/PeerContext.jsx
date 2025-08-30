import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const PeerContext = createContext(null);

export const usePeerContext = () => useContext(PeerContext);

export const PeerContextProvider = ({ children }) => {
  const peer = useMemo(() => {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }, //basic stuns
      ],
    };
    return new RTCPeerConnection(config);
  }, []);

  const createOffer = useCallback(async () => {
    try {
      //   if (!localStream) {
      //     await getLocalStream();
      //   }

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }, [peer]);

  const createAnswer = useCallback(
    async (offer) => {
      try {
        //   if (!localStream) {
        //     await getLocalStream();
        //   }

        // so these r the remote that wanna connect
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        // hey this is my answer to that
        await peer.setLocalDescription(answer);
        return answer;
      } catch (error) {
        console.error("Error creating answer:", error);
        throw error;
      }
    },
    [peer]
  );

  const setRemoteAns = useCallback(
    async (ans) => {
      try {
        await peer.setRemoteDescription(ans);
      } catch (error) {
        console.error("Error setting remote description:", error);
        throw error;
      }
    },
    [peer]
  );
  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAns }}
    >
      {/* wrapper */}
      {children}
    </PeerContext.Provider>
  );
};
