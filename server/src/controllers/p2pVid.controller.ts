import { Request, Response } from "express";
import prisma from "../prisma.js";
import { Server, Socket } from "socket.io";

//-------------------------------socket managment---------------------------------
const emailToSocketMap = new Map();
const socketIdToEmailMap = new Map();

export const connecitonHandler = (io: Server, socket: Socket) => {
  //---------on connection ------------------
  console.log(`Socket Connected : ${socket.id}`);

  socket.on("send-msg", (msg) => {
    console.log("got message: ", msg);
    //io means all socket
    socket.broadcast.emit("receive-msg", msg);
  });
  //----------Room joining sockets-----------
  socket.on("room-join", (data) => {
    const { email, room } = data;
    emailToSocketMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    socket.join(room);
    //msg to room on user-joined
    socket.broadcast.to(room).emit("user-joined", { email, id: socket.id });

    io.to(socket.id).emit("room-join", {
      ...data,
      success: "Joined successfully",
    });
    //checks for sucess
  });

  //---------------call making ---------------------
  socket.on("call-user", (data) => {
    //emailId ,offer
    const { email, offer } = data;
    const senderEmail = socketIdToEmailMap.get(socket.id);
    //check if active ?
    const socketId = emailToSocketMap.get(email);
    // console.log(
    //   "call-user => sending to socketId:",
    //   socketId,
    //   "Sender email",
    //   senderEmail,
    //   "with offer:",
    //   offer
    // );

    //send to this io.to=>same bt doesnt auto excludes self
    if (!socketId || socketId === socket.id) return;
    io.to(socketId).emit("incoming-call", { from: senderEmail, offer });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected : ${socket.id}`);
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
