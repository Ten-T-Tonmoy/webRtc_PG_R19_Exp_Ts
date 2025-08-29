import { createServer } from "http";
import app from "./app.js";
import { setupSocket } from "./socket.js";
import { Request, Response } from "express";

const PORT: number = parseInt(process.env.PORT || "3000");
const httpServer = createServer(app);

setupSocket(httpServer);

app.get("/test", (req: Request, res: Response) => {
  res.send("its goin up broh");
});

app.get("/test2", (req: Request, res: Response) => {
  res.status(200).json({
    message: "server working properly",
  });
});

import bookRoutes from "./routes/bookRoutes.js";
import videoCallRoutes from "./routes/p2pVid.routes.js";

import helmet from "helmet";
import corsOption from "./config/cors.config.js";

//------------------- route handling ----------------------------------

app.use("/p2pcall/", videoCallRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
