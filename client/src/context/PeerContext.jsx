import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

const PeerContext = createContext(null);

export const usePeerContext = () => useContext(PeerContext);

export const PeerContextProvider = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(() => {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }, //basic stuns
      ],
    };
    return new RTCPeerConnection(config);
  }, []);

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
      //adding to rtc
    }
  };

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

  const handleGetTrack = useCallback((ev) => {
    const streams = ev.streams;
    setRemoteStream(streams[0]);
  });

  useEffect(() => {
    peer.addEventListener("track", handleGetTrack);

    return () => {
      peer.removeEventListener("track", handleGetTrack);
    };
  }, []);
  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer, //to format
        createAnswer,
        setRemoteAns,
        remoteStream,
        sendStream,
      }}
    >
      {/* wrapper */}
      {children}
    </PeerContext.Provider>
  );
};
