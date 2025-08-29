import React, { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const FE_URL = "http://localhost:3000/";
  const socket = useMemo(() => io(FE_URL), []); //keep it always memorized
  if (!socket) throw new Error("Socket not initialized");

  return (
    <SocketContext.Provider value={socket}>
      {/**wrapper basically  */}
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  return socket;
};
