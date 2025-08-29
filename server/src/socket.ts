import { Server } from "socket.io";
import { Request, Response } from "express";
import { Server as HTTPServer } from "http";

// createServer() => returns Server Http

export const setupSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected : ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected : ${socket.id}`);
    });

    socket.on("send", (msg) => {
      console.log("got message: ", msg);
      io.emit("receive", msg);
    });
  });
};