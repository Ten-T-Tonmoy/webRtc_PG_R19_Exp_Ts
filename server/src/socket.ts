import { Server } from "socket.io";
import { Request, Response } from "express";
import { Server as HTTPServer } from "http";
import { connecitonHandler } from "./controllers/p2pVid.controller.js";
import { Socket } from "socket.io";

// createServer() => returns Server Http
export const setupSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => connecitonHandler(io, socket));
};

// socket controllers dont get triggered by routes
