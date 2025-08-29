import express from "express";
import dotenv from "dotenv";
import { Request, Response, Express } from "express";
import corsOption from "./config/cors.config.js";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "url";
import path from "path";

//used concurrently and rimraf on script

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //views loc
//middleware >>app.use(middleware) runs for everyRequest |  app.set(key,val)
app.use(express.static(path.join(__dirname, "../public"))); //static file serve from this folder damn pain for css
//app.use("/endpoint",middleware) will only run for this endpoint
app.use(helmet());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

export default app;
