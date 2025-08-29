import { Request, Response } from "express";
import prisma from "../prisma.js";
import { Server, Socket } from "socket.io";

//-------------------------------socket managment---------------------------------

export const connecitonHandler = (io: Server, socket: Socket) => {
  const emaillToSocketMap = new Map();
  const socketIdToEmailMap = new Map();

  //---------on connection ------------------
  console.log(`Socket Connected : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected : ${socket.id}`);
  });

  socket.on("send", (msg) => {
    console.log("got message: ", msg);
    io.emit("receive", msg);
  });
};

/**
 * main => email or link to get connected ?
 * vidpage
 * sidechat + 2 cams on bottom audio+vid+screenshare option
 */
export const p2pCallCreate = async (req: Request, res: Response) => {
  //pretty much useless for now
  res.status(200).json({
    success: "Call request send",
  });
};
