import React, { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";


const SocketContext=createContext(null);



export const SocketContextProvider=({children})=>{
    return(
        <SocketContext.Provider>
            {children}
        </SocketContext.Provider>
    )
}